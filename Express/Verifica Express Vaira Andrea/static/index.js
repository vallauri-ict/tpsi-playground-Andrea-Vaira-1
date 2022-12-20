"use strict";
$(document).ready(function () {
  let _sez1 = $("#sez1");
  let _btnAggiungiDomanda = $("#btnAggiungiDomanda");
  let _btnAvviaTest = $("#btnAvviaTest");

  let _sez2 = $("#sez2");
  let _txtFile = $("input[type=file]");
  let _btnCaricaDomanda = $("#btnCaricaDomanda");

  let _sez3 = $("#sez3");
  let _elencoDomande = $("#elencoDomande");
  let _btnInvia = $("#btnInvia");

  _sez2.hide();
  _sez3.hide();

  _btnAggiungiDomanda.on("click", () => {
    _sez2.show();
    _sez3.hide();
  });

  _btnAvviaTest.on("click", () => {
    _sez2.hide();
    _sez3.show();

    let request = inviaRichiesta("GET", "/api/elencoDomande");
    request.fail(errore);
    request.done((domande) => {
      console.log(domande);
      _elencoDomande.empty();
      for (let i = 0; i < domande.length; i++) {
        creaDomanda(domande[i]);
      }
    });
  });

  function creaDomanda(domanda) {
    let divRow = $("<div>");
    divRow.addClass("row").appendTo(_elencoDomande);
    let divImg = $("<div>").appendTo(divRow).addClass("col-sm-6");
    let img = $("<img>")
      .appendTo(divImg)
      .prop("src", "img/" + domanda.img);

    let divContainer = $("<div>").appendTo(divRow).addClass("col-sm-6");
    let p = $("<p>").appendTo(divContainer).text(domanda.domanda);
    for (let i = 0; i < domanda.risposte.length; i++) {
      let input = $("<input>")
        .appendTo(divContainer)
        .prop("type", "radio")
        .prop("name", domanda._id)
        .val(i);
      let span = $("<span>").appendTo(divContainer).text(domanda.risposte[i]);
      $("<br>").appendTo(divContainer);
    }
  }

  _btnInvia.on("click", () => {
    let risposte = [];
    for (let i = 0; i < _elencoDomande.children().length; i++) {
      let divRow = _elencoDomande.children().eq(i);
      let divContainer = divRow.children().eq(1);
      let input = divContainer.find("input[type=radio]:checked");
      if (input.length != 0) {
        let risposta = { id: input.prop("name"), indiceRisposta: input.val() };
        risposte.push(risposta);
      }
    }
    let request = inviaRichiesta("POST", "/api/risposte", {
      risposte: risposte,
    });
    request.fail(errore);
    request.done((ris) => {
      console.log(ris);
      alert("Risposte inviate correttamente");
      alert("Hai fatto " + ris.ris + " punti");
    });
  });

  $("#txtFile").on("change", function () {
    console.log($(this).prop("files")[0]);
    let promise = base64Convert($(this).prop("files")[0]);
    promise.catch((err) => {
      console.error(err);
    });
    promise.then((imgBase64) => {
      $("#imgNuovaDomanda").attr("src", imgBase64);
    });
  });

  _btnCaricaDomanda.on("click", () => {
    let form = $("#formNuovaDomanda");
    let domanda = $("#txtDomanda").val();
    let risposte = [];

    for (let i = 1; i < 5; i++) {
      if (form.find("input[type='text']").eq(i).val() != "") {
        console.log(form.find("input[type='text']").eq(i).val());
        risposte.push(form.find('input[type="text"]').eq(i).val());
      } else break;
    }
    if (risposte.length == 4) {
      console.log(risposte);
    } else {
      alert("Inserire tutte le risposte");
      return;
    }

    let checkValue;
    if (form.find("input[type='radio']:checked").val() == undefined) {
      alert("Selezionare una risposta corretta");
      return;
    } else {
      checkValue = form.find("input[type='radio']:checked").val();
      console.log(checkValue);
    }

    let image = $("#txtFile").prop("files")[0];
    let formData = new FormData();
    formData.append("image", image);
    formData.append("domanda", domanda);
    formData.append("risposte", risposte);
    formData.append("checkValue", checkValue);

    let request = inviaRichiestaMultipart(
      // flusso binario, non urlencoded e non JSON
      "POST",
      "/api/aggiungiDomanda",
      formData
    );
    request.fail(errore);
    request.done((ris) => {
      console.log(ris);
      alert("Inserimento avvenuto correttamente");
    });
  });
});

function base64Convert(img) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}
