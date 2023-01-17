"use strict"
// cordova plugin add cordova-plugin-dialogs, cordova-plugin-device-motion
    
$(document).ready(function() {
  document.addEventListener('deviceready', function() {

    let results = $("#results")

    $("#btnAvvia").on("click", startWatch)
    $("#btnArresta").on("click", stopWatch);

	let accelerationOptions = {
		enableHighAccuracy: false,
		timeout: 5000,
		maximumAge: 0,
		frequency:3000
	};
	
    let watchID = null;	
    function startWatch() {
        results.html("");
        if (!watchID){
			watchID = navigator.accelerometer.watchAcceleration(success, error, accelerationOptions);
            notifica("Lettura Avviata");
		}
    }

    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
            notifica("Lettura Arrestata");
        }
    }

	// .toLocaleTimeString('it-IT', { hour12: false }) funziona su ios ma
	// non su android. Su Internet dicono di usare moment()

    function success(acceleration) {
		let data = (new Date(acceleration.timestamp))
		           .toLocaleTimeString('it-IT', { hour12: false })
        let str =  data +
			"<br>" +
		    '&nbsp; X=' + acceleration.x.toFixed(3) +
            '&nbsp; Y=' + acceleration.y.toFixed(3) + 
            '&nbsp; Z=' + acceleration.z.toFixed(3);           
        results.html(str + "<hr/><br/>")
		console.log(acceleration.timestamp)
    }

    function error(err) {
        notifica("Errore: " + err.code + " - " + err.message);
    }

    function notifica(msg) {
        navigator.notification.alert(
            msg,
            function() {},
            "Accelerometro", // Titolo finestra
            "Ok"             // pulsante di chiusura
        );
    }
  })
});