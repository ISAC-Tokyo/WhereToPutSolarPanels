var COORDINATE_DECIMAL = 2;

print('Start aggregate by location and date')
print(Date());
 
// lat, lonが近い物が同じキーとなる
function map() {

  // 位置のまるめ
  // round(49.11627197265625, 3) => 49.116
  var round = function(val, decimal) {
    val = val * Math.pow(10, decimal);
    val = Math.round(val);
    val = val / Math.pow(10, decimal);
    return val;
  }
  // ISODate to "201301"
  var toMonth = function(d) {
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    return String(year) + String(month);
  }
  
  var key = toMonth(this.date) + '_' + round(this.loc.lat, COORDINATE_DECIMAL) + '_' + round(this.loc.lon, COORDINATE_DECIMAL);
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
    month: keys[0],
    loc: {
      lat: keys[1],
      lon: keys[2],
    },
    totalScore: value.score,
    totalLow: value.low,
    count: value.count,
    score: value.score / value.count,
    low: value.low / value.count
  }
}

var outCollection = 'bymonth_scale' + COORDINATE_DECIMAL;
var res = db.cloud_mask.mapReduce(map, reduce, {
  out: outCollection,
  finalize: finalize,
  scope: {
    COORDINATE_DECIMAL: COORDINATE_DECIMAL
  },
  verbose: true
});  

print('count: ', db[outCollection].find().count());
print('Finished');
print(Date());
