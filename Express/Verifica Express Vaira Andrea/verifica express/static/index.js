"use strict"
$(document).ready(function() {

    let _sez1 = $("#sez1")
	let _btnAggiungiDomanda = $("#btnAggiungiDomanda")
    let _btnAvviaTest = $("#btnAvviaTest")

    let _sez2 = $("#sez2")
    let _txtFile = $("input[type=file]")
    let _btnCaricaDomanda = $("#btnCaricaDomanda")

    let _sez3 = $("#sez3")
	let _elencoDomande =  $("#elencoDomande")
	let _btnInvia = $("#btnInvia");
	

  

})






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
  })
}