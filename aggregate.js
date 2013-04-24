print('Start aggregate by location')

/**
 * Round value of latitude.
 * 
 * round(49.11627197265625, 3) => 49.116
 *
 */
function round(val, decimal) {
  val = val * Math.pow(10, decimal);
  val = Math.round(val);
  val = val / Math.pow(10, decimal);
  return val;
}

(function() {
  
  // lat, lonが近い物が同じキーとなる
  function map() {
    var key = {
      date: this.date,
      loc: {
        lat: round(this.loc.lat, 3),
        lon: round(this.loc.lon, 3)
      }
    }
    emit(key, {
      score: this.score,
      low: this.low
    });
  }

  // scoreとlowを平均する
  function reduce(key, values) {
    var totalScore = 0,
        totalLow = 0;

    values.forEach(function(v) {
      totalScore += v.score;
      totalLow += v.low;
    });

    return {
      score: totalScore / values.length,
      low: totalLow / values.length
    }
  }

  var res = db.cloud_mask.mapReduce(map, reduce, {out: 'scale3'});  
  print('count: ', db.scale3s.find().count());

})();