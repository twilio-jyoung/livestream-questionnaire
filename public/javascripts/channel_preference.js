// {
//   "question_1":"text",  text, chat, push, phone, email
//   "question_2":"me",
//   "question_3":"my company",
//   "question_4":"Fiji"
// }

var channel_preference = (function() {
  var chart = null;
  var rendered = false;
  var data = {
    text: 0,
    chat: 0,
    phone: 0,
    push: 0,
    email: 0
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
    var ctx = document.getElementById("question_1").getContext("2d");
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: ["#F22F46", "#0D122B", "#36D576", "#F47C22", "#EFDC2E"]
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
    console.log("charts - updating channel_preference chart");
    console.log(chart.data.datasets[0].data);

    let index = null;

    switch (input) {
      case "text":
        index = 0;
        break;
      case "chat":
        index = 1;
        break;
      case "phone":
        index = 2;
        break;
      case "push":
        index = 3;
        break;
      case "email":
        index = 4;
        break;
    }

    chart.data.datasets[0].data[index]++;
    chart.update();
  }

  return {
    aggregate: aggregate
  };
})();
