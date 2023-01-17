"use strict"
const DIM = 30;

// DISABILITARE LA ROTAZIONE AUTOMATICA DELLO SCHERMO !!

$(document).ready(function () {
  document.addEventListener("deviceready", function () {
		
	let _pallina = $(".pallina");
	let _buca = $(".buca");
	let _punti = $(".punti");

	let bucaLeft;
	let bucaTop;

	let watchID = null;
	let accelerationOptions = {
		"enableHighAccuracy": false,   
		"timeout": 5000,
		"maximumAge": 0,
		"frequency": 150
	}

	let windowWidth = $(window).width();     
	let windowHeight = $(window).height();  
	
	_pallina.css({
		"top": windowHeight/2 - DIM/2,
		"left": windowWidth/2 - DIM/2
	})
	
	generaBuca();

	startWatch();

	let timer = setInterval(verifica, 25);  

	/* ***************************************************************** */

   function generaBuca() {
		// evitiamo di posizionare le buche troppo vicine ai bordi
		// Il bordo SINISTRO della buca deve stare 
		// non oltre i 60xp dal lato dx dello schermo
		bucaLeft = random(DIM, windowWidth - 2*DIM); 
		// Il bordo SUPERIORE della buca deve stare 
		// non oltre i 60xp dal fondo dello schermo		
		bucaTop = random(DIM, windowHeight - 2*DIM);  
		_buca.css({
			"left": bucaLeft,
			"top": bucaTop
		})
	}
	
   function startWatch() {
    watchID = navigator.accelerometer.watchAcceleration(success, errore, accelerationOptions)
		if (watchID == null)
			notifica("Impossibile avviare l'accelerometro");
	}

	function stopWatch() {
		if (watchID != null) {
			navigator.accelerometer.clearWatch(watchID);
			watchID = null;
		}
	}






	function success(acceleration) {
		// posizione attuale della pallina
		let x = parseInt(_pallina.css("left"));
		let y = parseInt(_pallina.css("top"));

		// ruotando il telefono l'asse X punta verso il basso
		let dx = - acceleration.x; 
		let dy = acceleration.y;

	   /* Tra una lettura e l'altra passano 150ms
		Calcoliamo allora la nuova posizione che dovrà avere la palla fra 150ms
		Questa posizione dipende dalla maggiore/minore inclinazione del telefono
		Se dx = 0 e dy=0 (telefono appoggiato sul tavolo) la pallina rimane FERMA
		In caso di acc max (9.8), decidiamo di eseguire uno spostamento 
		   di 30px in 150ms 												   */

		let newX = x + (dx * 3);
		let newY = y + (dy * 3);

        // INDISPENSABILE lasciare un minimo di margine 
		// per NON accodare le animazioni
		_pallina.animate({ "left": newX, "top": newY }, 146); 
	}

	
	function verifica() {
		let pallinaLeft = parseInt(_pallina.css("left"));
		let pallinaTop = parseInt(_pallina.css("top"));

		if (pallinaLeft <= 0 || pallinaLeft >= (windowWidth - DIM)  ||
			pallinaTop <= 0 || pallinaTop >= (windowHeight - DIM) ) {
			notifica("Game over. Punti: " + _punti.text());
			stop();
		}
		// Se c'entro la buca prendo 1 punto
		else if (Math.abs(pallinaLeft - bucaLeft) <= 4
			  && Math.abs(pallinaTop - bucaTop) <= 4) {
				  
			stop();
			
			// Fermo animazione e sensore. Mediante una animazione da 1500 ms
			// porto a ZERO le dimensioni della pallina in modo da simulare 
			// la caduta in buca.
			
			let newProp = {
				"width": 0,
				"height": 0,
				/* centro la pallina rispetto alla buca */
				"left": bucaLeft + DIM / 2,
				"top": bucaTop + DIM / 2
			}			
			_pallina.animate(newProp, 1500, function () {				
				_punti.text(parseInt(_punti.text())+1)
				generaBuca();
				_pallina.css({
					"width": "",
					"height": "",
					"background-color": ""
				});				
				startWatch();
				timer = setInterval(verifica, 25);
			});
		}
	}

	function stop() {
		stopWatch();
		clearInterval(timer);
		_pallina.stop(true);   // fermo animazioni in corso
		_pallina.css({ "background-color": "red" });
	}


/* *********************************************************************** */


	function errore(err) {
		notifica("Errore: " + err.code + " - " + err.message);
	}

	function notifica(msg) {
		navigator.notification.alert(
			msg,
			function () {},
			"Info",       // Titolo finestra
			"Ok"          // pulsante di chiusura
		);
	}	
	
	function random(a, b) {
		return (Math.floor((b - a + 1) * Math.random()) + a);
	}
  });
})