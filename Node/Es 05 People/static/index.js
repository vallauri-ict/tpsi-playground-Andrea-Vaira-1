"use strict";

$(document).ready(function () {
  let _lstNazioni = $("#lstNazioni");
  let _tabStudenti = $("#tabStudenti");
  let _divDettagli = $("#divDettagli");

  let country;

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
          country = $(this).text();
          caricaTabella();
        });
    }
  });

  function visualizzaDettagli() {
    // gli passo il json con title name last
    let person = $(this).prop("person");

    let request = inviaRichiesta("POST", "/api/details", { person });
    request.fail(errore);
    request.done((data) => {
      console.log(data);
      _divDettagli.show();
      _divDettagli.children("img").prop("src", data.picture.medium);
      _divDettagli
        .find("h5")
        .text(`${data.name.title} ${data.name.first} ${data.name.last}`);
      let str = `<b>Gender</b> ${data.gender} <br>
                    <b>Address</b> ${JSON.stringify(data.location)} <br>
                    <b>Email</b> ${data.email} <br>
                    <b>DOB</b> ${JSON.stringify(data.dob)}`;
      _divDettagli.find("p").html(str);
    });
  }

  function elimina() {
    let person = $(this).prev().prop("person");
    let request = inviaRichiesta("POST", "/api/delete", { person });
    request.fail(errore);
    request.done((data) => {
      alert("Record cancellato correttamente");
      caricaTabella();
    });
  }

  function caricaTabella() {
    let request = inviaRichiesta("POST", "/api/people", { country });
    request.fail(errore);
    request.done((people) => {
      // console.log(people);
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
          .prop("person", person)
          .on("click", visualizzaDettagli);

        td = $("<td>").appendTo(tr);
        $("<button>").appendTo(td).text("Elimina").on("click", elimina);
      }
    });
  }
});
