"use strict";

$(document).ready(function () {
  let divIntestazione = $("#divIntestazione");
  let divFilters = $(".card").eq(0);
  let divCollections = $("#divCollections");
  let table = $("#mainTable");
  let divDettagli = $("#divDettagli");
  let currentCollection = "";

  divFilters.hide();
  $("#lstHair").prop("selectedIndex", -1);

  let request = inviaRichiesta("GET", "/api/getCollections");
  request.fail(errore);
  request.done((collections) => {
    console.log(collections);

    for (const collection of collections) {
      let label = divCollections.children("label").eq(0).clone();
      label.children("span").text(collection.name);
      label.children("input").val(collection.name);
      label.appendTo(divCollections);
      divCollections.append("<br>");
    }
    divCollections.children("label").eq(0).remove();
  });
});
