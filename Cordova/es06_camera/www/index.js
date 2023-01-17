﻿"use strict"
// cordova plugin add cordova-plugin-camera
    
$(document).ready(function() {
  document.addEventListener('deviceready', function() {
 
	let wrapper = $("#wrapper")	

	
    let cameraOptions = {
	    destinationType: Camera.DestinationType.DATA_URL, 
		correctOrientation: true,
		// encodingType: Camera.EncodingType.JPEG,
	}
    

    $("#btnScatta").on("click", acquisisciFoto)
    $("#btnCerca").on("click", acquisisciFoto)

	
	function acquisisciFoto(){
		if($(this).prop("id")=="btnScatta")
			cameraOptions.sourceType=Camera.PictureSourceType.CAMERA
		else
			cameraOptions.sourceType=Camera.PictureSourceType.PHOTOLIBRARY 
		let request = navigator.camera.getPicture(onSuccess, onError, cameraOptions)
		/*  le promise NON sembrano funzionare !
		    let request = ...
			request.then(onSuccess)
			request.catch(onError)    */
	}
	


    function onSuccess(imageData) {
		console.log(imageData)
        $("<img>").appendTo(wrapper)
		.css({"width":100})  // height si adatta automaticamente
		.prop("src", "data:image/jpeg;base64," + imageData)
		// .prop("src", imageData)
    }
	

    function onError(err) {
		/* se l'utente usa il pulsante BACK senza scegliere nessuna foto,
		   viene richiamato onError, passandogli però code = undefined */
		if (err.code)
			notifica("Errore: " + err.code + " - " + err.message);
    }
	

   function notifica(msg){		 
        navigator.notification.alert(
		    msg,    
		    function() {},       
		    "Info",       // Titolo finestra
		    "Ok"          // pulsante di chiusura
	    );			 
	}
	
  });  
}); 