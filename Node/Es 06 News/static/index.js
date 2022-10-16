"use strict";

$(document).ready(function () {
  let wrapper = $("#wrapper");

  caricaNotizie();

  function dettagli() {
    let titoloNotizia = $(this).prop("record").titolo;
    let requestDettagli = inviaRichiesta("POST", "/api/dettagli", {
      titoloNotizia,
    });
    requestDettagli.fail(errore);
    requestDettagli.done((dettagli) => {
      console.log(dettagli);
      caricaNotizie();
      $("#news").html(dettagli.file);
    });
  }

  function caricaNotizie(notizie) {
    let requestNotizie = inviaRichiesta("GET", "/api/elenco");
    requestNotizie.fail(errore);
    requestNotizie.done((notizie) => {
      console.log(notizie);

      wrapper.empty();
      for (const notizia of notizie) {
        $("<span>")
          .appendTo(wrapper)
          .addClass("titolo")
          .text(notizia.titolo + " ");
        $("<a>")
          .appendTo(wrapper)
          .prop({ href: "#", record: notizia })
          .text(" Leggi ")
          .on("click", dettagli);
        $("<span>")
          .appendTo(wrapper)
          .addClass("nVis")
          .text(` visualizzato ${notizia.visualizzazioni} volte`);
        $("<br>").appendTo(wrapper);
      }
    });
  }
});
