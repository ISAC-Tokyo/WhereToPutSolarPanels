#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
# vim: set noet sts=4 sw=4 ts=4 fdm=marker :
#


require 'optparse'

options = {}

opt = OptionParser.new
opt.banner = <<EOU
Usage: #{$0} [OPTIONS]
Options:
EOU

opt.on('-r RESOLUTION', '--resolution RESOLUTION') do |v|
	options[:resolution] = v
end

opt.on('-c COLLECTION', '--collection COLLECTION') do |v|
	options[:collection] = v
end

opt.on('--month') {|v| options[:month] = v}

begin
	_rest = opt.parse ARGV
rescue OptionParser::InvalidOption => e
	warn e.message
	puts opt
	abort
end

resolution = options[:resolution]
collection = options[:collection]

unless resolution or collection then
	puts opt
	abort
end

require 'erb'
ERB.new(DATA.read).run


__END__
//同じ位置のスコアを全期間で集計する
var byMonth = <% if options[:month] then %> true <%else%> false <%end%>;

var COORDINATE_DECIMAL = <%= resolution%>;
var aggregateCollection = "<%= collection%>";
var outCollection = byMonth ? 'scale' + COORDINATE_DECIMAL + '_by_month' : 'alldate_scale' + COORDINATE_DECIMAL;

print('Start aggregate by location and date')
print(Date());

// 小数桁を指定したまるめ
// round(49.11627197265625, 3) => 49.116
function round(val, decimal) {
  val = val * Math.pow(10, decimal);
  val = Math.round(val);
  val = val / Math.pow(10, decimal);
  return val;
}
 
// ISODate to "201301"
function toMonth(d) {
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  return String(year) + String(month);
}

// lat, lonが近い物が同じキーとなる
function map() {
<% if options[:month] then %>
  var key = toMonth(this.date) + '_' + round(this.loc.lat, COORDINATE_DECIMAL) + '_' + round(this.loc.lon, COORDINATE_DECIMAL);
<% else %>
  var key = round(this.loc.lat, COORDINATE_DECIMAL) + '_' + round(this.loc.lon, COORDINATE_DECIMAL);
<% end %>
  emit(key, {
    score: this.score,
    low: this.low,
    count: 1
  });
}

// scoreとlowを積みあげる
function reduce(key, values) {
  var totalScore = 0,
      totalLow = 0,
      totalCount = 0;

  values.forEach(function(v) {
    totalScore += Number(v.score);
    totalLow += Number(v.low);
    totalCount += v.count;
  });

  return {
    score: totalScore,
    low: totalLow,
    count: totalCount
  }
}

function finalize(key, value) {
  var keys = key.split('_');
  return {
<% if options[:month] then %>
    month: keys[0],
<% end %>
    loc: {
      lat: Number(keys[0]),
      lon: Number(keys[1])
    },
    totalScore: value.score,
    totalLow: value.low,
    count: value.count,
    score: round(value.score / value.count, 4),
    low: round(value.low / value.count, 4)
  }
}

var res = db[aggregateCollection].mapReduce(map, reduce, {
  out: outCollection,
  finalize: finalize,
  scope: {
    round: round,
    toMonth: toMonth,
    COORDINATE_DECIMAL: COORDINATE_DECIMAL
  },
  verbose: true
});

print('count: ', db[outCollection].find().count());
print('Finished. Created collection ', outCollection);
print(Date());
print('===========================');

