(function($, undefined) {

  function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)&?')
                    .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  var solarTypes = {
    t: {
      name: 't',
      power: 250,
      realIncomePerMonth: 15156.1375,
      limit: 6, // year
      price: 1814400
    },
    m: {
      name: 'm',
      power: 185,
      realIncomePerMonth: 14097.125,
      limit: 9,
      price: 1651300
    },
    k: {
      name: 'Sera',
      power: 200,
      realIncomePerMonth: 14853.5625,
      limit: 20,
      price: 1806000
    },
    p: {
      name: 'Sonic',
      power: 233,
      realIncomePerMonth: 17274.1625,
      limit: 10,
      price: 2242240
    }
  };


  function plotPlofitSimulation(solarPanelType) {
    var startyear = 2000;
    var panel = solarTypes[solarPanelType];
    var month = 20;// * 12; // 20 years
    var year = 20;
    var datasets = [
      {
        label: "Initial Cost (yen)",
        data: [[startyear, panel.price], [startyear+month, panel.price]]
      },
      {
        label: "Integrated Cost (yen)",
        data: []
      }
    ];

    var limit = panel.limit;

    for (var i = 0; i <= month; i++) {
      datasets[1].data.push([i+startyear, (function(i) {
        var prev = 0;
        var append = 0;
        if (i > 0) {
          prev = datasets[1].data[i - 1][1];
          append = Math.max(panel.realIncomePerMonth * 12 * Math.min(1, (limit * 1.5 - i/1.5)/limit), 0);
        }
        console.log(i);
        return prev + append;
      })(i)]);
    }
    console.log(datasets);

    $.plot("#result-graph", datasets, {
      yaxis: {
        min: 0
      },
      xaxis: {
        tickDecimals: 0
      }
    });
  }

  function plotCloudyDistribution() {
  }

  
  $(function() {
    var panelType = getParameterByName('panelType');
    plotPlofitSimulation(panelType)
  });

})(jQuery);

