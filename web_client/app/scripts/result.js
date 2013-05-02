(function($, global, undefined) {

  var sp = global.wpsp.sp;
  var utils = global.wpsp.utils;

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)&?')
                    .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  function fetchRank(lat, lon, callback) {
    $.ajax({
      url: wpsp.API_BASE + '/rank',
      crossDomain: true,
      data: {
        lat: lat,
        lon: lon
      },
    }).done(function(ret) {
      console.log(ret);
      callback(ret);
    }).fail(function(e) {
      console.log("Failed to fetch place evaluation data for (" + lat + ", " + lon + ")");
    });
  }

  var scoreLabels = {
    "0": "very poor",
    "1": "very poor",
    "2": "poor",
    "3": "good",
    "4": "excellent"
  }

  function calcSimulation(solarPanelType, score) {
    if (solarPanelType == undefined || sp.profiles[solarPanelType] == undefined) {
      alert('Invalid solar panel type speciified');
      return;
    }
    var profile = sp.profiles[solarPanelType];
    var simulator = new sp.SolarPanelSimulator(profile);
    simulator.calc(score);
    var results = simulator.getDataSeries();

    plotRevenueSimulation(results, profile);

    return {
      profile: profile,
      ave: simulator.getCostRecoveryTermNorm(),
      yourScore: simulator.getCostRecoveryTerm(),
      areaModule: simulator.areaModule,
      instVol: simulator.instVol,
      gen: simulator.gen
    }
  }

  function plotRevenueSimulation(results, profile) {
    var month = 20 * 12;// 20 years
    var datasets = [
      {
        label: "Initial Cost (yen)",
        data: [[0, profile.initCost], [month, profile.initCost]]
      }, {
        label: "Revenue with average cloud score (yen)",
        data: []
      }, {
        label: "Revenue with your location cloud score (yen)",
        data: []
      }
    ];

    for (var i = 0; i <= month; i++) {
      datasets[1].data.push([i, results[0][i]]);
      datasets[2].data.push([i, results[1][i]]);
    }

    $.plot("#result-graph", datasets, {
      yaxis: {
        min: 0,
        tickFormatter: function(num) {
          num = Math.round(num/1000);
          while (num != (num = String(num).replace(/^(-?\d+)(\d{3})/, "$1,$2")));
          return num;
        }
      },
      xaxis: {
      },
      legend: {
        position: "se"
      }
    });
    var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
      .text("Total Revenue (1,000 Yen)")
      .appendTo($('#result-graph'));
    var xaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
      .text("Month")
      .appendTo($('#result-graph'));
  }

  function plotTemporalDistribution(data, from, to) {
    var plotSet = [];
    var fromDate = (new Date(from));
    var year = fromDate.getFullYear();
    var month = fromDate.getMonth() + 1;
    for (var i = 0; i < data.length; i++) {
      if (month > 12) { month = 1; year += 1 }
      plotSet.push([Date.parse(year + "/" + month), data[i]]);
      month += 1;
    }
    $.plot("#distribution-graph", [plotSet], {
      yaxis: {
        min: 0,
        tickSize: 1,
        tickDecimals: 0
      },
      xaxis: {
        mode: "time",
        timeformat: "%Y/%m",
        minTickSize: [1, "month"],
        timezone: "browser"
      },
      series: {
        bars: {
          show: true,
          barWidth: 10,
          align: "center",
          horizontal: false
        }
      }
    });
  }

  function updateInformationPanel(results) {
    if (results.rank != undefined) {
      $("#score").html(results.rank);
      $("#score-label").html(scoreLabels[results.rank.toString()]);
    }
    if (results.total_score != undefined) {
      $("#score-days").html(results.total_score);
    }
  }

  function updateSimulationDesc(simulated) {
    var data = {
      initCost: simulated.profile.initCost / 1000,
      recoveryTermYear: utils.round(simulated.yourScore/12, 1),
      faster: utils.round((simulated.ave - simulated.yourScore)/12, 1),
      areaModule: utils.round(simulated.areaModule, 3),
      instVol: utils.round(simulated.instVol, 3),
      gen: utils.round(simulated.gen, 3)
    }

    $('.simulation-desc h3,p,li').each(function(idx, el) {
      var template = $(el).html();
      console.log(template);
      var rendered = Mustache.render(template, data);
      $(el).html(rendered);
    });
  }

  $(function() {
    var panelType = getParameterByName('panelType'),
        lat = getParameterByName('lat'),
        lon = getParameterByName('lon');

    fetchRank(lat, lon, function(result) {
      console.log("Fetched:", result);
      plotTemporalDistribution(result.series.data, result.series.from, result.series.to);
      updateInformationPanel(result);
      var simulated = calcSimulation(panelType, result.total_score/result.series.data.length);
      updateSimulationDesc(simulated);
    });
  });

})(jQuery, window);

