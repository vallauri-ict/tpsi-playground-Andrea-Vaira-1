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

$(document).ready(function () {
  // creazione dinamica del CDN di accesso alle google maps
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url + "/js?v=3&key=" + MAP_KEY + "&callback=documentReady";
  document.body.appendChild(script);
});

function documentReady() {
  hideFilter();
  let request = inviaRichiesta("GET", "/api/perizie");
  request.fail(errore);
  request.done(function (perizie) {
    popolaMappa(perizie);
  });
  $("#btnFilter").on("click", function () {
    showFilter();
  });
}
function hideFilter() {
  $("#filter").hide();
  $("#map").css("margin-left", "13%");
}
function showFilter() {
  $("#filter").show();
  $("#map").css("margin-left", "20px");
}
function popolaMappa(perizie) {
  let geocoder = new google.maps.Geocoder();
  navigator.geolocation.getCurrentPosition((position) => {
    let latlng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        let mapOptions = {
          center: results[0].geometry.location,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP, // default=ROADMAP
        };
        mappa = new google.maps.Map($("#map")[0], mapOptions);
        for (const perizia of perizie) {
          let currentPos = new google.maps.LatLng(
            perizia.coordinate.latitude,
            perizia.coordinate.longitude
          );
          let markerOptions = {
            map: mappa,
            position: currentPos,
            _id: perizia._id,
          };
          let marcatore = new google.maps.Marker(markerOptions);
          marcatore.addListener("click", function () {
            console.log(this._id);
          });
        }
      }
    });
  });
}
