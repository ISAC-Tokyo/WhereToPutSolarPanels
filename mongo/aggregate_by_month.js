var COORDINATE_DECIMAL = 2;

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
      lat: Number(keys[1]),
      lon: Number(keys[2]),
    },
    totalScore: value.score,
    totalLow: value.low,
    count: value.count,
    score: round(value.score / value.count, 4),
    low: round(value.low / value.count, 4)
  }
}

var outCollection = 'scale' + COORDINATE_DECIMAL + '_by_month';
var res = db.cloud_mask.mapReduce(map, reduce, {
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
