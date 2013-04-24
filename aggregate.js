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
  function map() {
    var key = {
      date: this.date,
      lat: round(this.lat.lat, 3),
      lon: round(this.lat.lon, 3)
    }
    emit({
      score: this.score,
      low: this.low
    });
  }

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