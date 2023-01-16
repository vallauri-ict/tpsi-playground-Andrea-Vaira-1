"use strict"
// cordova plugin add cordova-plugin-dialogs, vibrate, splashscreen
    
$(document).ready(function() {
	// attesa caricamento dei plugin 
    document.addEventListener('deviceready', function() {
		
    })
})

// fuori dal document.ready, perchè devono essere accessibili dall'html
function showAlert(){
	navigator.notification.alert(
		"Game Over !",     // Messaggio da visualizzare
		function(){},      // callback anonima vuota
		"Alert",           // Titolo finestra
		"Done"             // pulsante di chiusura (singolo)
	);
}


function showConfirm(){    // Scelta multipla
	navigator.notification.confirm(
		"Vuoi salvare ?",      // Messaggio da visualizzare
		onConfirm,             // callback 
		"Confirm",             // Titolo finestra
		["Si", "No", "Forse"]  // Pulsanti da visualizz (Vettore di stringhe)
		// L'ordine di visualizzazione su schermo è diverso 
		// rispetto all'ordine di scrittura: 0=NO, 1=SI, 2=FORSE
	);
}
// indice del pulsante premuto  
function onConfirm(buttonIndex){ 
	if(buttonIndex==1) // SI
	   alert("Dati salvati correttamente");
	else
	   alert("Operazione annullata");
}


function showPrompt(){       // Input Box
	navigator.notification.prompt(
		"Enter your name ",  // Messaggio da visualizzare
		onPrompt,			 // callback 
		"Registration",      // Titolo finestra
		["Ok", "Exit"],      // Pulsanti da visualizz (Vettore di stringhe)
		"Joe Doe"            // Default Text
	);
}
function onPrompt (results){
	if(results.buttonIndex == 1)
		alert("Your name is : " + results.input1);
}


function playBeep(){
	navigator.notification.beep(2); // Numero di beep
}


function vibrate(){  // Eseguito SOLO su telefono, non sul simulatore
	navigator.vibrate([500, 500, 500]); // beep, pausa, beep, ......
}

