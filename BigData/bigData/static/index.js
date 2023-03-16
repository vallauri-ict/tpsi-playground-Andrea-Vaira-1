"use strict";

$(document).ready(function () {
  let easing = helpers.easingEffects.easeOutQuad;
  let restart = false;
  const totalDuration = 1000;
  const duration = (ctx) =>
    (easing(ctx.index / data.length) * totalDuration) / data.length;
  const delay = (ctx) => easing(ctx.index / data.length) * totalDuration;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;
  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: duration,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return delay(ctx);
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: duration,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return delay(ctx);
      },
    },
  };


  const config = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          borderColor: "rgb(75, 192, 192)",
          //backgroundColor: window.chartColors.red,
          data: [],
          fill: false,
          borderWidth: 1.5,
          pointbackgroundColor: "rgb(75, 192, 192)",
          pointBorderColor: "rgb(75, 192, 192)",
          pointBorderWidth: 1,
        },
      ],
    },
    options: {
      animation,
      interaction: {
        intersect: false,
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Chart.js Line Chart",
        },
      },
    },
  };

  let chart = new Chart(document.getElementById("myChart"), config);
  let myInterval = null;

  $("#myChart").hide();
  $("#table").hide();
  let sensor = "";
  $(".dropdown-item").click(function () {
    sensor = $(this).text();
    clearInterval(myInterval);
    newChart();
  });

  function newChart() {
    disegnaGrafico();
    myInterval = setInterval(function () {
      disegnaGrafico();
    }, 5000);
  }

  function disegnaGrafico() {
    $("#myChart").show();
    $("#table").show();
    let sensorId = sensor.split(" ")[0];
    let request = inviaRichiesta("GET", "/api/getData", { sensorId });
    request.fail(errore);
    request.done(function (data) {
      aggiornaGrafico(data);
      aggiornaTabella(data);
    });
  }

  function aggiornaTabella(data) {
    let value = data.map((el) => el.value);
    $("#average").text(media(value));
    $("#standardDeviation").text(stdDev(value));
    $("#min").text(min(value));
    $("#max").text(max(value));
    $("#median").text(median(value));
    $("#mode").text(mode(value));
    $("#range").text(range(value));
  }

  function aggiornaGrafico(data) {
    //chart = new Chart(document.getElementById("myChart"), config);
    let time = data.map((el) => el.timestamp);
    let value = data.map((el) => el.value);
    config.data.labels = time;
    config.data.datasets[0].data = value;
    //config.options.plugins.title.text = sensor;
    config.data.datasets[0].label = sensor;
    // chart.data.labels=time;
    // chart.data.datasets[0].data=value;

    // new Chart(document.getElementById("myChart"), config);
    chart.update();
  }
});
