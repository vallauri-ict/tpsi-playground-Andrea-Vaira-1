$(document).ready(function () {
  let txtUser = $("#txtUser");
  let txtFile = $("#txtFile");

  getImages();

  function getImages() {
    let request = inviaRichiesta("GET", "/api/images");
    request.fail(errore);
    request.done(function (data) {
      console.log(data);
      let tbody = $("#mainTable").children("tbody");
      tbody.empty();
      for (const item of data) {
        let tr = $("<tr>").appendTo(tbody).addClass("text-center");
        $("<td>").appendTo(tr).text(item.username).css("font-size", "14pt");
        let td = $("<td>").appendTo(tr);
        if (!item.img.toString().startsWith("data:image")) {
          item.img = "img/" + item.img;
        }
        $("<img>").prop("src", item.img).css("max-height", "60px").appendTo(td);
      }
    });
  }

  $("#btnBinary").on("click", function () {
    let username = txtUser.val();
    let image = txtFile.prop("files")[0];

    if (!username || !image) {
      alert("Inserire username e immagine");
    } else {
      let formData = new FormData();
      formData.append(image);
      formData.append(username);

      let request = inviaRichiestaMultipart(
        "POST",
        "/api/binaryUpload",
        formData
      );
      request.fail(errore);
      request.done((ris) => {
        console.log(ris);
        alert("Inserimento avvenuto correttamente");
        getImages();
      });
    }
  });
});

/* *********************** resizeAndConvert() ****************************** */
/* resize (tramite utilizzo della libreria PICA.JS) and base64 conversion    */
function resizeAndConvert(file) {
  /* step 1: lettura tramite FileReader del file binario scelto dall'utente.
			   File reader restituisce un file base64
	// step 2: conversione del file base64 in oggetto Image da passare alla lib pica
	// step 3: resize mediante la libreria pica che restituisce un canvas
				che trasformiamo in blob (dato binario di grandi dimensioni)
	// step 4: conversione del blob in base64 da inviare al server               */
  return new Promise(function (resolve, reject) {
    const WIDTH = 640;
    const HEIGHT = 480;
    let type = file.type;
    let reader = new FileReader();
    reader.readAsDataURL(file); // restituisce il file in base 64
    //reader.addEventListener("load", function () {
    reader.onload = function () {
      let img = new Image();
      img.src = reader.result; // reader.result restituisce l'immagine in base64
      img.onload = function () {
        if (img.width < WIDTH && img.height < HEIGHT) resolve(reader.result);
        else {
          let canvas = document.createElement("canvas");
          if (img.width > img.height) {
            canvas.width = WIDTH;
            canvas.height = img.height * (WIDTH / img.width);
          } else {
            canvas.height = HEIGHT;
            canvas.width = img.width * (HEIGHT / img.height);
          }
          let _pica = new pica();
          _pica
            .resize(img, canvas, {
              unsharpAmount: 80,
              unsharpRadius: 0.6,
              unsharpThreshold: 2,
            })
            .then(function (resizedImage) {
              // resizedImage è restituita in forma di canvas
              _pica
                .toBlob(resizedImage, type, 0.9)
                .then(function (blob) {
                  var reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onload = function () {
                    resolve(reader.result); //base 64
                  };
                })
                .catch((err) => reject(err));
            })
            .catch(function (err) {
              reject(err);
            });
        }
      };
    };
  });
}
