"use strict";

$(document).ready(function () {
  let requestStates = inviaRichiesta("GET", "/api/elenco");
  requestStates.fail(errore);
  requestStates.done((radios) => {
    //console.log(JSON.stringify(radios));
    for (const radio of radios) {
      $("<option>")
        .text(`${radio.name} [${radio.stationcount} emittenti]`)
        .val(radio.value)
        .appendTo($("#lstRegioni"));
    }
  });

  let requestLikeImage = inviaRichiesta("GET", "/like.jpg");
  requestLikeImage.fail(errore);
  requestLikeImage.done((data) => {
    console.log(data);
  });

  $("#lstRegioni").on("change", function () {
    let state = $(this).children(":selected").val();
    console.log(state);
    let requestRadios = inviaRichiesta("GET", "/api/radios", { state });
    requestRadios.fail(errore);
    requestRadios.done((radios) => {
      console.log(radios);
      let tbody = $("#tbody");
      for (const radio of radios) {
        let tr = $("<tr>").appendTo(tbody);
        let td = $("<td>").appendTo(tr);
        $("<img>")
          .prop("src", radio["favicon"])
          .css("width", "40px")
          .appendTo(td);
        $("<td>").appendTo(tr).text(radio.name);
        $("<td>").appendTo(tr).text(radio.codec);
        $("<td>").appendTo(tr).text(radio.bitrate);
        $("<td>").appendTo(tr).text(radio.votes);
        let tdLike = $("<td>").appendTo(tr);
        let imgLike = $("<img>").appendTo(tdLike);
        /*let requestImg = inviaRichiesta("POST", "/imgLike");
        requestImg.fail(errore);
        requestImg.done((img) => {
          imgLike.prop("src", data);
        });*/
      }
    });
  });
});
