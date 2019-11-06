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

var influencer_person = (function() {
  console.log("init ip");
  var rendered = false;

  var data = {};

  console.log(data);

  function aggregate(person) {
    var newPerson = false;
    if (data[person]) {
      data[person]++;
    } else {
      newPerson = true;
      data[person] = 1;
    }

    if (!rendered) {
      rendered = true;
      renderChart();
    } else {
      updateChart(person, newPerson);
    }
  }

  var chart = null;

  function renderChart() {
    console.log("charts - rendering influencer_person chart");
    var ctx = document.getElementById("influencer_person").getContext("2d");
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

  function updateChart(person, isNew) {
    console.log("charts - updating influencer_person chart with " + person);

    if (isNew) {
      chart.data.labels.push(person);
      chart.data.datasets[0].data.push(data[person]);
    } else {
      // get this person's index in the label array which should match the data array index
      var personIndex = chart.data.labels.indexOf(person);
      chart.data.datasets[0].data[personIndex]++;
    }
    chart.update();
  }

  return {
    aggregate: aggregate
  };
})();
