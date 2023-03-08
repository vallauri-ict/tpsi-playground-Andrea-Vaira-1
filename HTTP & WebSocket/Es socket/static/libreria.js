"use strict";

const _URL = "http://localhost:1337"


function caricaGoogleMaps(){
	let promise =  new Promise(function(resolve, reject){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = MAPS_URL + '/js?v=3&key=' + MAP_KEY;
		document.body.appendChild(script);
		script.onload = resolve;  // onload non inietta alcun dato
		script.onerror = function (){
		    reject("Errore caricamento GoogleMaps")
		}
	})
	return promise
}


function inviaRichiesta(method, url, parameters={}) {
	let config={
		"baseURL":_URL,
		"url":  url, 
		"method": method,
		"headers": {
			"Accept": "application/json",
		},
		"timeout": 5000,
		"responseType": "json",
	}
	if(method.toUpperCase()=="GET"){
	   config.headers["Content-Type"]='application/x-www-form-urlencoded;charset=utf-8' 
	   config["params"]=parameters   // plain object or URLSearchParams object
	}
	else{
		config.headers["Content-Type"] = 'application/json; charset=utf-8' 
		config["data"]=parameters     // Accept FormData, File, Blob
	}	
	return axios(config)              // return a promise
}


function errore(err) {
	if(!err.response) 
		alert("Connection Refused or Server timeout");	
	else if (err.response.status == 200)
        alert("Formato dei dati non corretto : " + err.response.data);
    else
        alert("Server Error: " + err.response.status + " - " + err.message);
}


function generaNumero(a, b){
	return Math.floor((b-a)*Math.random()) + a;
}