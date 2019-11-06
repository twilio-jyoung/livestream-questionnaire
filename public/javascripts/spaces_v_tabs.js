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

var spaces_v_tabs = (function() {
  console.log("spaces_v_tabs");
  var chart = null;
  var rendered = false;
  var data = {
    spaces: 0,
    tabs: 0
  };

  function aggregate(input) {
    data[input]++;
    if (!rendered) {
      rendered = true;
      renderChart();
    } else {
      updateChart(input);
    }
  }
  function renderChart() {
    // console.log("charts - rendering spaces_v_tabs chart");
    var ctx = document.getElementById("spaces_v_tabs").getContext("2d");
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: ["#F22F46", "#0D122B"]
          }
        ]
      },
      options: {
        legend: {
          position: "right"
        }
      }
    });
  }
  function updateChart(input) {
    // console.log("charts - updating spaces_v_tabs chart");

    var index = input == "spaces" ? 0 : 1;
    chart.data.datasets[0].data[index]++;
    chart.update();
  }

  return {
    aggregate: aggregate
  };
})();
