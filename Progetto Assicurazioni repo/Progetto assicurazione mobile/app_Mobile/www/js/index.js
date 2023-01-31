//document.addEventListener('deviceready', onDeviceReady, false);

window.onload = async function () {
  $("#section").hide();
  await caricaGoogleMaps();

  $("#home").show();
  let foto = [];
  $("#section").hide();

  $("#btnNewReport").on("click", function () {
    $("#section").show();
    $("#newReport").show();
    $("#home").hide();
    $("#UserSettings").hide();

    $("#actionButton").hide();
    $("#newPhto").hide();

    foto = [];
  });

  $("#btnUserSettings").on("click", function () {
    let requestOperatore = inviaRichiesta("GET", "/api/operatore1");
    requestOperatore.fail(errore);
    requestOperatore.done(function (operatore) {
      $("#section").show();
      $("#newReport").hide();
      $("#home").hide();
      $("#userSettings").show();

      $("#newPwd").hide();

      operatore = operatore[0];
      console.log(operatore);
      $("#logo").prop("src", operatore['"img"']);
      $("#userSettings")
        .children("h2")
        .eq(0)
        .text("Number report: " + operatore.nPerizie);
      $("#txtMail").val(operatore.email);
      $("#txtName").val(operatore.nome);
    });
  });

  $("#btnNewPwd").on("click", function () {
    $("#newPwd").show();
    $("#actionButton").hide();
  });

  $("#btnUpdatePwd").on("click", function () {
    $("#newPwd").hide();

    let pwd1 = $("#newPwd").children("input").eq(0).val();
    let pwd2 = $("#newPwd").children("input").eq(1).val();
    if (pwd1 != pwd2) {
      alert("Password not match");
      return;
    }
    let request = inviaRichiesta("POST", "/api/updatePwd", { pwd: pwd1 });
    request.fail(errore);
    request.done(function (data) {
      alert("Password updated");
    });
  });

  $("#logo").on("click", function () {
    let cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      // encodingType: Camera.EncodingType.JPEG,
    };
    let request = navigator.camera.getPicture(
      onSuccess,
      onError,
      cameraOptions
    );
    function onSuccess(imageData) {
      console.log(imageData);
      $("#logo").prop("src", "data:image/jpeg;base64," + imageData);
      // .prop("src", imageData)
    }

    function onError(err) {
      /* se l'utente usa il pulsante BACK senza scegliere nessuna foto,
		   viene richiamato onError, passandogli però code = undefined */
      if (err.code) notifica("Errore: " + err.code + " - " + err.message);
    }
  });

  $("#btnUpdate").on("click", function () {
    let mail = $("#txtMail").val();
    let name = $("#txtName").val();
    let img = $("#logo").prop("src");
    let request = inviaRichiesta("POST", "/api/updateOperatore", {
      mail,
      name,
      img,
    });
    request.fail(errore);
    request.done(function (data) {
      alert("Updated");
      $("#section").hide();
      $("#userSettings").hide();
      $("#home").show();
    });
  });

  $("#btnAddImage").on("click", function () {
    $("#actionButton").show();
  });

  $("#btnMakePhoto").on("click", function () {
    $("#actionButton").hide();
    $("#newPhto").show();
    let cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: Camera.PictureSourceType.CAMERA,
      // encodingType: Camera.EncodingType.JPEG,
    };
    let request = navigator.camera.getPicture(
      onSuccess,
      onError,
      cameraOptions
    );
    function onSuccess(imageData) {
      console.log(imageData);
      $("#imgPhoto").prop("src", "data:image/jpeg;base64," + imageData);
      // .prop("src", imageData)
    }

    function onError(err) {
      /* se l'utente usa il pulsante BACK senza scegliere nessuna foto,
       viene richiamato onError, passandogli però code = undefined */
      if (err.code) notifica("Errore: " + err.code + " - " + err.message);
    }
  });

  $("#btnFindPhoto").on("click", function () {
    $("#actionButton").hide();
    $("#newPhto").show();
    let cameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      // encodingType: Camera.EncodingType.JPEG,
    };
    let request = navigator.camera.getPicture(
      onSuccess,
      onError,
      cameraOptions
    );
    function onSuccess(imageData) {
      console.log(imageData);
      $("#imgPhoto").prop("src", "data:image/jpeg;base64," + imageData);
      // .prop("src", imageData)
    }

    function onError(err) {
      /* se l'utente usa il pulsante BACK senza scegliere nessuna foto,
       viene richiamato onError, passandogli però code = undefined */
      if (err.code) notifica("Errore: " + err.code + " - " + err.message);
    }
  });

  $("#btnSendPhoto").on("click", function () {
    $("#newPhto").hide();
    let img = $("#imgPhoto").prop("src");
    let request = inviaRichiesta("POST", "/api/newPhoto", { img });
    request.fail(errore);
    request.done(function (data) {
      foto.push({
        img: data.path,
        commento: $("#photo").children("textarea").eq(0).val(),
      });
      $("#imgPhoto").prop("src", "");
      $("#photo").children("textarea").eq(0).val("");
    });
  });

  $("#btnSend").on("click", function () {
    navigator.geolocation.watchPosition(visualizzaPosizione, error, {
      enableHighAccuracy: false, // meno preciso, bassa risoluzione
      timeout: 5000,
      maximumAge: 0,
    });

    function visualizzaPosizione(position) {
      let record = {
        coordinate: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        descrizione: $("#txtDescrizione").val(),
        "data-ora": Date.now().toString(),
        foto: foto,
      };
      let request = inviaRichiesta("POST", "/api/newReport", record);
      request.fail(errore);
      request.done(function (data) {
        alert("Report sent");
        $("#section").hide();
        $("#home").show();
        $("#txtDescrizione").val("");
      });
    }

    function error(err) {
      alert("Error: " + err.code + " - " + err.message);
    }
  });
}

/*async function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    
}*/

function caricaGoogleMaps() {
  const URL = "https://maps.googleapis.com/maps/api";
  let promise = new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = URL + "/js?v=3&key=" + MAP_KEY;
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
  });
  return promise;
}