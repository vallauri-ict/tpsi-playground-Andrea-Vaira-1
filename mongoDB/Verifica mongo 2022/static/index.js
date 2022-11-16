"use strict";

$(document).ready(function () {
  let request = inviaRichiesta("GET", "/api/elencoClassi");
  request.fail(errore);
  request.done(function (data) {
    //console.log(data);
    for (const classe of data) {
      let option = $("<option>")
        .appendTo("#lstClasses")
        .text(classe)
        .prop({ classe });
    }
  });

  $("#btnFind").on("click", function () {
    let classe = $("#lstClasses").val();
    if (
      !$("body").find("input").eq(0).prop("checked") &&
      !$("body").find("input").eq(1).prop("checked")
    ) {
      alert("Selezionare un filtro");
    } else {
      let gender;
      if ($("body").find("input").eq(0).prop("checked")) gender = "m";
      else gender = "f";

      classe = $("#lstClasses").val();
      let request = inviaRichiesta("GET", "/api/elencoStudenti", {
        gender,
        classe,
      });
      request.fail(errore);
      request.done(function (data) {
        let tbody = $("tbody");
        tbody.empty();
        for (const studente of data) {
          let tr = $("<tr>").appendTo(tbody);
          $("<td>").appendTo(tr).text(studente.nome);
          $("<td>").appendTo(tr).text(studente.valutazioni[0].voto);
          $("<td>").appendTo(tr).text(studente.valutazioni[1].voto);
          $("<td>").appendTo(tr).text(studente.valutazioni[2].voto);
          $("<td>").appendTo(tr).text(studente.valutazioni[3].voto);
        }
      });
    }
  });

  $("#es2").on("click", function () {
    let request = inviaRichiesta("GET", "/api/es2");
    request.fail(errore);
    request.done(function (ris) {
      console.log(ris);
    });
  });

  $("#es3").on("click", function () {
    let request = inviaRichiesta("GET", "/api/es3");
    request.fail(errore);
    request.done(function (ris) {
      console.log(ris);
    });
  });

  $("#es4").on("click", function () {
    let request = inviaRichiesta("GET", "/api/es4");
    request.fail(errore);
    request.done(function (ris) {
      console.log(ris);
    });
  });

  $("#es5").on("click", function () {
    let request = inviaRichiesta("GET", "/api/es5");
    request.fail(errore);
    request.done(function (ris) {
      console.log(ris);
    });
  });

  $("#es6").on("click", function () {
    let request = inviaRichiesta("GET", "/api/es6");
    request.fail(errore);
    request.done(function (ris) {
      console.log(ris);
    });
  });
});
