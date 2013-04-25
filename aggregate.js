print('Start aggregate by location and date')
print(Date());
 
(function() {
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
    
    var key = {
      month: toMonth(this.date),
      loc: {
        lat: round(this.loc.lat, 4),
        lon: round(this.loc.lon, 4)
      }
    }
    emit(key, {
      score: this.score,
      low: this.low,
      totalScore: 0,
      totalLow: 0,
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
      low: totalLow / values.length,
      totalScore: totalScore,
      totalLow: totalLow
    }
  }
 
  var res = db.cloud_mask.mapReduce(map, reduce, {out: 'scale4'});  
  print('count: ', db.scale4.find().count());
})();

print('Finished');
print(Date());
