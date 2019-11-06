// "data": {
//   "spaces_v_tabs": "tabs",
//   "country": {
//       "name": "fiji",
//       "location": {
//           "lat": -17.713371,
//           "lng": 178.065032
//       }
//   },
//   "influencer_person": "musk",
//   "influencer_company": "google"
// },

var country = (function() {
  google.charts.load("current", {
    "packages": ["geochart"],
    "mapsApiKey": google_api_key
  });
  google.charts.setOnLoadCallback(renderChart);

  var data = {};

  function aggregate(country) {
    if (data[country]) {
      data[country]++;
    } else {
      data[country] = 1;
    }
    getDataTableData();
    renderChart();
  }

  var chart = null;

  function renderChart() {
    var data = google.visualization.arrayToDataTable(getDataTableData());
    var options = {
      backgroundColor: "#0D122B",
      colorAxis: { colors: ["#FCCBD1", "#F22F46"] },
      keepAspectRatio: true
      // legend: "none"
    };
    chart = new google.visualization.GeoChart(document.getElementById("country_map"));
    chart.draw(data, options);
  }

  function getDataTableData() {
    var result = [];
    result.push(["Country", "Count"]);

    for (var country in data) {
      if (data.hasOwnProperty(country)) {
        var count = data[country];
        result.push([country, count]);
      }
    }

    return result;
  }

  return {
    aggregate: aggregate
  };
})();
