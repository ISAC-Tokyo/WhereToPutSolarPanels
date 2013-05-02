// Solar Panel Simulation Module
(function(global, undefined) {
  "use strict";

  if (global.wpsp == undefined) {
    global.wpsp = {};
  }
  var exports = global.wpsp.sp = {};

      // システム出力係数
  var E_POWER = 0.7,
      // 1W当り発電量[kWh/kW/year]
      UNIT_GEN = 1050,
      // 設置面積[m2]
      INS_AREA = 35,
      // 従来の電気料金[JPY]
      ORDINARY_ENERGY_COST = 10500,
      // 買い取り価格(2013年度の太陽光発電固定価格買い取り制度としてkwh当たり38円を踏襲)
      UNIT_PRICE = 38,
      // 日本における快晴度スコアの中央値
      CLOUDLESS_SCORE_MID = 0.3043,
      // 最小値
      CLOUDLESS_SCORE_MIN = 0.0844,
      // 最大値
      CLOUDLESS_SCORE_MAX = 0.5777;


  /**
   * initCost: 初期価格[JPY]
   * pow: 出力[W/m2]
   * effModule: モジュール変換効率
   * usefulLife: 耐用年数[month]
   * lifeCoff: 寿命係数
   */
  var profiles = [{
    name: "Solar A",
    initCost: 1000000,
    pow: 250,
    effModule: 0.154,
    usefulLife: 71,
    lifeCoff: 0.013
  }, {
    name: "Solar B",
    initCost: 1200000,
    pow: 300,
    effModule: 0.187,
    usefulLife: 84,
    lifeCoff: 0.011
  }, {
    name: "Solar C",
    initCost: 1500000,
    pow: 350,
    effModule: 0.16,
    usefulLife: 115,
    lifeCoff: 0.008
  }, {
    name: "Solar D",
    initCost: 2000000,
    pow: 200,
    effModule: 0.17,
    usefulLife: 184,
    lifeCoff: 0.005
  }];

  // Constructor
  function SolarPanelSimulator(profile) {
    if (this == null || this == window) {
      throw "Call me with new operator";
    }
    this.profile = profile;
    this.results = {};
  }
  SolarPanelSimulator.name = "SolarPanelSimulator";

  function cloudlessScore2Impact(score) {
    var diff  = score - CLOUDLESS_SCORE_MID;
    // Between -1 to +1
    var impact = Math.max(Math.min(diff/((CLOUDLESS_SCORE_MAX - CLOUDLESS_SCORE_MIN)/2), 1), -1)
    // Between 0.8 to 1.2
    return 1 + 0.2 * impact;
  }

  /**
   * Calc energy generation simulation with cloud effect
   */
  function calc(cloudlessScore) {
    var p = this.profile,
        // モジュール面積
        areaModule = p.pow / p.effModule / 1000,
        // 設置量kw
        instVol = p.pow * INS_AREA / areaModule / 1000,
        // 発電量
        gen = instVol * E_POWER * UNIT_GEN,
        // 月間売電収入
        revenuePerMonth = gen * UNIT_PRICE / 12,
        // 月間の利益
        grossProfit = ORDINARY_ENERGY_COST - 7000 + revenuePerMonth,
        // 雲の影響度
        cloudImpact = cloudlessScore2Impact(cloudlessScore);

    console.log("life Coff", p.lifeCoff);
    console.log("Cloud impact", cloudImpact);

    // Results
    var series1 = [0], // Clac without cloud impact
        series2 = [0], // Calc with cloud impact
        reduction = 0, 
        y1 = 0, 
        y2 = 0, 
        paid1 = undefined, 
        paid2 = undefined,
        period = 12 * 20; // 20 year

    for (var x = 1; x < period; x++) {
      reduction = Math.exp(-1 * p.lifeCoff * x);
      y1 = reduction * grossProfit + series1[x-1];
      y2 = reduction * grossProfit * cloudImpact + series2[x-1];

      if (!paid1 && y1 > p.initCost) {
        paid1 = x;
      }
      if (!paid2 && y2 > p.initCost) {
        paid2 = x;
      }
      series1.push(y1);
      series2.push(y2);
    }
    this.results.paidWithoutCloudImpact = paid1;
    this.results.paidWithCloudImpact = paid2;
    this.results.dataSeries = [series1, series2];
    this.results.period = period;
  }

  function getDataSeries() {
    return this.results.dataSeries;
  }

  function getCostRecoveryTermNorm() {
    return this.results.paidWithoutCloudImpact;
  }

  function getCostRecoveryTerm() {
    return this.results.paidWithCloudImpact;
  }

  SolarPanelSimulator.prototype = {
    constructor: SolarPanelSimulator,
    calc: calc,
    getDataSeries: getDataSeries,
    getCostRecoveryTermNorm: getCostRecoveryTermNorm,
    getCostRecoveryTerm: getCostRecoveryTerm
  }

  //export
  exports.SolarPanelSimulator = SolarPanelSimulator;
  exports.cloudlessScore2Impact = cloudlessScore2Impact;
  exports.profiles = profiles;

})(this);
