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

var influencer_company = (function() {
  console.log("init ic");
  var rendered = false;

  var data = {};

  console.log(data);

  function aggregate(company) {
    var newCompany = false;
    if (data[company]) {
      data[company]++;
    } else {
      newCompany = true;
      data[company] = 1;
    }

    if (!rendered) {
      rendered = true;
      renderChart();
    } else {
      updateChart(company, newCompany);
    }
  }

  var chart = null;

  function renderChart() {
    console.log("charts - rendering influencer_company chart");
    var ctx = document.getElementById("influencer_company").getContext("2d");
    chart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: ["#F22F46", "#0D122B", "#36D576", "#F47C22", "#EFDC2E", "#8C5BD8", "#21A4C9"]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1
              }
            }
          ]
        }
      }
    });
  }

  function updateChart(company, isNew) {
    console.log("charts - updating influencer_company chart with " + company);

    if (isNew) {
      chart.data.labels.push(company);
      chart.data.datasets[0].data.push(data[company]);
    } else {
      // get this company's index in the label array which should match the data array index
      var companyIndex = chart.data.labels.indexOf(company);
      chart.data.datasets[0].data[companyIndex]++;
    }
    chart.update();
  }

  return {
    aggregate: aggregate
  };
})();
