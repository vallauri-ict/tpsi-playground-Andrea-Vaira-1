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
      label
        .children("input")
        .val(collection.name)
        .on("click", function () {
          currentCollection = $(this).val();
          divIntestazione.find("strong").eq(0).text(currentCollection);
          getCollection();
        });
      label.appendTo(divCollections);
      divCollections.append("<br>");
    }
    divCollections.children("label").eq(0).remove();
  });

  $("#btnAdd").on("click", () => {
    divDettagli.empty();
    //<button type="button" class="btn btn-success" id="btnAdd">
    $("<textarea>").text("{}").appendTo(divDettagli);
    $("<button>")
      .appendTo(divDettagli)
      .addClass("btn btn-success")
      .text("Aggiungi")
      .on("click", () => {
        let stream = divDettagli.children("textarea").val(); // .val() non .text()
        stream = stream.replaceAll("'", '"'); // virgolette singole --> err, doppie --> OK
        try {
          stream = JSON.parse(stream);
        } catch (error) {
          alert("Formato inserito non valido");
          return;
        }
        let request = inviaRichiesta("POST", "/api/" + currentCollection, {
          stream,
        });
        request.fail(errore);
        request.done((data) => {
          console.log(data);
          alert("Record inserito correttamente");
          getCollection();
        });
      });
  });

  $("#btnFind").on("click", function () {
    // prendo i parametri
    let hair = $("#lstHair").val().toLowerCase();
    let gender = null;
    if (!$("#chkMale").prop("checked") && !$("#chkFemale").prop("checked")) {
      alert("Seleziona almeno un genere");
    } else if (
      ($("#chkMale").prop("checked") && !$("#chkFemale").prop("checked")) ||
      (!$("#chkMale").prop("checked") && $("#chkFemale").prop("checked"))
    ) {
      gender = divFilters.find("input[type=checkbox]:checked").val();
    } else {
      gender = null;
    }
    if (gender != null) {
      let request = inviaRichiesta("GET", "/api/unicorn", { hair, gender });
      request.fail(errore);
      request.done((data) => {
        console.log(data);
        createTable(data);
      });
    } else {
      let request = inviaRichiesta("GET", "/api/unicorn", { hair });
      request.fail(errore);
      request.done((data) => {
        console.log(data);
        createTable(data);
      });
    }
  });

  function getCollection() {
    // let collection = divCollections.children('input:checked').val();
    let request = inviaRichiesta("GET", "/api/" + currentCollection);
    request.fail(errore);
    request.done((data) => {
      console.log(data);
      createTable(data);
      if (currentCollection == "unicorns") {
        divFilters.show();
      } else {
        divFilters.hide();
      }
    });
  }

  function createTable(data) {
    let tbody = table.children("tbody");
    tbody.empty();
    divIntestazione.find("strong").eq(1).text(data.length);
    for (const record of data) {
      let tr = $("<tr>").appendTo(tbody);
      $("<td>")
        .appendTo(tr)
        .text(record._id)
        .prop("_id", record._id)
        .on("click", dettagli);
      $("<td>")
        .appendTo(tr)
        .text(record.val)
        .prop("_id", record._id)
        .on("click", dettagli);
      let td = $("<td>").appendTo(tr);
      $("<div>").appendTo(td);
      $("<div>").appendTo(td);
      $("<div>").appendTo(td);
    }
  }

  function dettagli() {
    let _id = $(this).prop("_id");
    let request = inviaRichiesta("GET", `/api/${currentCollection}/${_id}`);
    request.fail(errore);
    request.done((data) => {
      console.log(data);
      let str = "";
      for (const key in data) {
        str += `<b>${key}</b>: ${data[key]} <br>`;
      }
      divDettagli.html(str);
    });
  }
});
