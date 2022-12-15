// import
import http from "http";
import https from "https";
import url from "url";
import fs from "fs";
import express, { NextFunction } from "express";     
import axios from "axios";           
import { Http2ServerResponse } from "http2";


// config
const app = express();
const HTTP_PORT = process.env.PORT || 1337
const HTTPS_PORT = 1338
const privateKey  = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = { "key": privateKey, "cert": certificate }; 


/* ****************** Creazione ed Avvio del Server ************************ */
let httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
    init();
});

let httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, function(){
	console.log("Server in ascolto sulle porte HTTP:" + HTTP_PORT + ", HTTPS:" + HTTPS_PORT);
});


let paginaErrore: string = "";
function init() {
    fs.readFile("./static/error.html", function(err:any, data:any) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}


//****************************************************************
//elenco delle middleware routes 
//****************************************************************

// 1.log 
app.use("/", function (req, res, next) {
	console.log("---->  " + req.method + ":" + req.originalUrl);
	next();
});


// 2.static route
app.use("/", express.static("./static"));


// 3.route lettura parametri post
app.use("/", express.json({ "limit": "10mb" }));
app.use("/", express.urlencoded({"extended": true, "limit": "10mb"}));


// 5.log parametri
app.use("/", function (req, res, next) {
		if (Object.keys(req.query).length > 0) {
			console.log("Parametri GET: ", req.query);
		}
		if (Object.keys(req.body).length > 0) {
			// console.log("Parametri BODY: ", req.body);
		}
		next();
})


/** user root **/
app.get('/api/people', (req, res, next:NextFunction)=>{
	let url = 'https://randomuser.me/api?results=5';
	axios.get(url,  {headers: {'Accept-Encoding': 'application/json'}})
	.then((response:any)=>{
		res.send(response.data);
	})
	.catch((err:Error)=>{
		res.status(500);
		res.send(err.message)
	})
})