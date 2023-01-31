/*"use strict";
$(document).ready(function () {
  let tBody = $("#tabMail tbody");

  getMails();

  function getMails() {
    let mailRQ = inviaRichiesta("GET", "/api/elencoMail");
    mailRQ.fail(errore);
    mailRQ.done(function (data) {
      $(".container").css("visibility", "visible");
      $("#txtTo").val("");
      $("#txtSubject").val("");
      $("#txtMessage").val("");
      tBody.empty();
      for (let mail of data) {
        let tr = $("<tr>");
        let td;
        td = $("<td>").text(mail.from).appendTo(tr);
        td = $("<td>").text(mail.subject).appendTo(tr);
        td = $("<td>").text(mail.body).appendTo(tr);
        tBody.append(tr);
      }
    });
  }

  $("#btnInvia").on("click", function () {
    let mail = {
      to: $("#txtTo").val(),
      subject: $("#txtSubject").val(),
      message: $("#txtMessage").val(),
    };
    let newMailRQ = inviaRichiesta("POST", "/api/newMail", mail);
    newMailRQ.done(function (data) {
      console.log(data);
      alert(data.ris);
    });
    newMailRQ.fail(errore);
  });

  /* ************************* LOGOUT  *********************** */

/*  Per il logout è inutile inviare una richiesta al server.
		E' sufficiente cancellare il cookie o il token dal pc client
		Se però si utilizzano i cookies la gestione lato client è trasparente,
		per cui in quel caso occorre inviare una richiesta al server        */

// if using http headers
/*$("#btnLogout").on("click", function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });

  /* if using cookies 
	$("#btnLogout").on("click", function() {
		let rq = inviaRichiesta('POST', '/api/logout');
		rq.done(function(data) {
			window.location.href = "login.html"
		});
		rq.fail(errore)		
	}) 
	*/
//});
"use strict";

const url = "https://maps.googleapis.com/maps/api";
let mappa;

let commenti = {
  vetCommenti: [],
  index: 0,
};

$(document).ready(function () {
  // creazione dinamica del CDN di accesso alle google maps
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url + "/js?v=3&key=" + MAP_KEY + "&callback=documentReady";
  document.body.appendChild(script);
});

function documentReady() {
  $("#perizia").hide();
  hideFilter();
  let request = inviaRichiesta("GET", "/api/perizie");
  request.fail(errore);
  request.done(function (perizie) {
    popolaMappa(perizie);
  });
  $("#btnFilter").on("click", function () {
    showFilter();
    let request = inviaRichiesta("GET", "/api/operatori");
    request.fail(errore);
    request.done(function (operatori) {
      popolaOperatori(operatori);
    });
  });

  /**** carousel management *****/
  $(".carousel-control-prev").on("click", function () {
    commenti.vetCommenti[commenti.index] = $(
      "#exampleFormControlTextarea2"
    ).val();
    if (commenti.index == 0) commenti.index = commenti.vetCommenti.length - 1;
    else commenti.index--;
    $("#exampleFormControlTextarea2").val(commenti.vetCommenti[commenti.index]);
    console.log(commenti.vetCommenti);
  });

  $(".carousel-control-next").on("click", function () {
    commenti.vetCommenti[commenti.index] = $(
      "#exampleFormControlTextarea2"
    ).val();
    if (commenti.index == commenti.vetCommenti.length - 1) commenti.index = 0;
    else commenti.index++;
    $("#exampleFormControlTextarea2").val(commenti.vetCommenti[commenti.index]);
    console.log(commenti.vetCommenti);
  });

  $("#commentCarousel")
    .children("button")
    .eq(0)
    .on("click", function () {
      let descrizione = $("#exampleFormControlTextarea1").val();

      commenti.vetCommenti[commenti.index] = $(
        "#exampleFormControlTextarea2"
      ).val();

      let foto = [];
      let imgs = $("#carouselExampleControls").find("img");
      for (let i = 0; i < commenti.vetCommenti.length; i++) {
        let record = {
          img: imgs.eq(i).prop("src"),
          commento: commenti.vetCommenti[i++],
        };
        foto.push(record);
      }

      let request = inviaRichiesta("POST", "/api/aggiornaPerizia", {
        descrizione,
        foto: JSON.stringify(foto),
        id: $(this).prop("id"),
      });
      request.fail(errore);
      request.done(function (data) {
        $("#perizia").hide();
        $("#home").show();
      });
    });
}

function popolaPerizia(perizia) {
  let divperizia = $("#dettagliPerizia");
  let requestOperatore = inviaRichiesta("GET", "/api/operatore", {
    _id: perizia.codOperatore,
  });
  requestOperatore.fail(errore);
  requestOperatore.done(function (operatore) {
    operatore = operatore[0];
    divperizia.children("img").eq(0).attr("src", operatore['"img"']);
    divperizia.children("h3").eq(0).text(operatore.username);

    let date = new Date(perizia["data-ora"]);
    let dataFormattata =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();
    divperizia.children("h4").eq(0).text(dataFormattata);

    divperizia.children("h4").eq(1).text(getIndirizzo(perizia.coordinate));

    divperizia.find("textarea").eq(0).text(perizia.descrizione);

    commenti.vetCommenti = [];
    commenti.index = 0;
    for (const img of perizia.foto) {
      let div = $("<div>");
      div.addClass("carousel-item");
      let imgTag = $("<img>");
      imgTag.addClass("d-block w-100");
      imgTag.prop("src", img.img);
      div.append(imgTag);
      $("#carouselExampleControls").children("div").append(div);
      commenti.vetCommenti.push(img.commento);
    }
    $("#carouselExampleControls")
      .children("div")
      .children("div")
      .eq(0)
      .addClass("active");
    $("#exampleFormControlTextarea2")
      .eq(0)
      .text(commenti.vetCommenti[commenti.index]);
  });

  $("#commentCarousel").children("button").eq(0).prop("id", perizia._id);
}

function popolaOperatori(operatori) {
  /**<li class="list-group-item d-flex justify-content-between align-items-center">
                    A list item
                    <span class="badge badge-success badge-pill">14</span>
                </li> */
  $("#filter").children("ul").eq(0).empty();
  let length = operatori.length;
  if (operatori.length > 15) {
    length = 15;
  }
  for (let index = 0; index <=length; index++) {
      const operatore = operatori[index];
      let li = $("<li>");
      li.addClass("list-group-item d-flex justify-content-between align-items-center");
      li.text(operatore.username.toCa);
      let span = $("<span>");
      span.addClass("badge badge-success badge-pill");
      span.text(operatore.nPerizie);
      li.append(span);
      $("#filter").children("ul").eq(0).append(li);
    }
}