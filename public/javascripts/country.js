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
  console.log("init country");

  // initializing map shiz
  console.log("charts - initializing country chart");

  google.charts.load("current", {
    "packages": ["geochart"],
    "mapsApiKey": "AIzaSyDEyfOQrycakL4z0P9ImSzF92MXKPTnUIU"
  });
  google.charts.setOnLoadCallback(renderChart);

  var data = {};

  console.log(data);

  function aggregate(country) {
    if (data[country.name]) {
      data[country.name].count++;
    } else {
      data[country.name] = { location: country.location, count: 1 };
    }
    getDataTableData();
    renderChart();
  }

  var chart = null;

  function renderChart() {
    console.log("charts - rendering country chart");

    var data = google.visualization.arrayToDataTable(getDataTableData());
    var options = {
      backgroundColor: "#0D122B",
      colorAxis: { colors: ["#FCCBD1", "#F22F46"] },
      keepAspectRatio: true,
      legend: "none"
    };
    chart = new google.visualization.GeoChart(document.getElementById("country_map"));
    chart.draw(data, options);
  }

  function getDataTableData() {
    var result = [];
    result.push(["Country", "Count"]);

    for (var country in data) {
      if (data.hasOwnProperty(country)) {
        var element = data[country];
        result.push([country, element.count]);
      }
    }

    return result;
  }

  return {
    aggregate: aggregate
  };
})();
