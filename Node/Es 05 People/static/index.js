"use strict";
$(document).ready(function () {
  let _lstNazioni = $("#lstNazioni");
  let _tabStudenti = $("#tabStudenti");
  let _divDettagli = $("#divDettagli");

  _divDettagli.hide();

  let request = inviaRichiesta("GET", "/api/nazioni");
  request.fail(errore);
  request.done((nazioni) => {
    console.log(nazioni.ris);
    for (const item of nazioni.ris) {
      // <a class="dropdown-item" href="#">Item</a>
      $("<a>")
        .addClass("dropdown-item")
        .prop("href", "#")
        .text(item)
        .appendTo(_lstNazioni)
        .on("click", function () {
          let country = $(this).text();
          let request = inviaRichiesta("POST", "/api/people", { country });
          request.fail(errore);
          request.done((people) => {
            console.log(people);
            _tabStudenti.empty();
            for (const person of people) {
              let tr = $("<tr>").appendTo(_tabStudenti);
              for (const key in person) {
                $("<td>").appendTo(tr).text(person[key]);
              }
              let td = $("<td>").appendTo(tr);
              $("<button>")
                .appendTo(td)
                .text("Dettagli")
                .on("click", visualizzaDettagli);

              td = $("<td>").appendTo(tr);
              $("<button>").appendTo(td).text("Elimina").on("click", elimina);
            }
          });
        });
    }
  });

  function visualizzaDettagli() {
    // gli passo il json con title name last
  }

  function elimina() {}
});
