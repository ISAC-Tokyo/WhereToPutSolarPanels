$(function() {
  var startyear = 2000;
  var datasets = [
    {
      label: "Initial Cost (yen)",
      data: [[startyear+0, 20000], [startyear+20, 20000]]
    },
    {
      label: "Integrated Cost (yen)",
      data: []
    }
  ];

  for (var i = 0; i <= 20; i += 1) {
    datasets[1].data.push([i+startyear, Math.log(i)*10000]);
  }

  $.plot("#placeholder", datasets, {
    yaxis: {
      min: 0
    },
    xaxis: {
      tickDecimals: 0
    }
  });

  $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
});

