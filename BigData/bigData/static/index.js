'use strict'

$(document).ready(function() {

    sensor = '';
    $('.dropdown-item').click(function() {
        sensor = $(this).text();
        clearChart();
        newChart();
    })

    function newChart() {
      setInterval(function () {
        let sensorId = sensor.split(" ")[0];
        let request = inviaRichiesta("GET", "/api/getData", { sensorId });
        request.fail(errore);
        request.done(function (data) {
            aggiornaGrafico(data);
        });
      }, 5000);
    }

    function clearChart() {
        
    }

    function aggiornaGrafico(data){
        const config = {
          type: "scatter",
          data: data,
          options: {
            scales: {
              x: {
                type: "linear",
                position: "bottom",
              },
            },
          },
        };

    }
})