"use strict"

// import
import fs from "fs";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import {MongoClient, ObjectId}  from "mongodb";
import fileUpload, { UploadedFile } from "express-fileupload";
import cors from "cors";
import nodemailer from "nodemailer";


// config
const app = express();
const HTTP_PORT = process.env.PORT || 1337;
dotenv.config({ path: ".env" });
const DBNAME = "5B";
const CONNECTION_STRING:any = process.env.connectionString;
const corsOptions = {
    origin: function(origin:any, callback:any) {
          return callback(null, true);
    },
    credentials: true
};
const auth = JSON.parse(process.env.gmail as string)
  //  { "user": process.env.gmail.user, "pass": process.env.gmail.password}
const message = fs.readFileSync("message.html", "utf8");


// ***************************** Avvio ****************************************
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, function() {
    init();
    console.log("Server HTTP in ascolto sulla porta " + HTTP_PORT);
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function(err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}


/* *********************** (Sezione 2) Middleware ********************* */
// 1. Request log
app.use("/", function(req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - risorse statiche
app.use("/", express.static('./static'));


// 3 - lettura dei parametri post
app.use("/", express.json({ "limit": "20mb" }));
app.use("/", express.urlencoded({"extended": true, "limit": "20mb"}));


// 4 - log dei parametri 
app.use("/", function(req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (20 * 1024 * 1024) } // 20*1024*1024 // 20 M
}));


// 6. cors 
app.use("/", cors(corsOptions));




/* ********************* (Sezione 3) USER ROUTES  ************************** */

let transporter = nodemailer.createTransport({
    "service": "gmail",
    "auth": auth
});

app.post('/api/newMail', function(req, res, next) {
    
	let msg =  message.replace('__user', "pippo").replace("__password", "pippo")
	
	let mailOptions = {
		"from": auth.user,
		"to": req.body.to,
		"subject": "Password account rilievi e perizie",
		// "text": msg,
		"html": msg,
		"attachments": [{
			"filename": "qrcode.png",
			"path": "./qrcode.png"
		}]
	}
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			res.status(500).send("Errore invio mail\n" + err.message);
		}
		else {
			console.log("Email inviata correttamente");
			res.send({
				"ris": "OK"
			});
		}
	})
});


/* ********************** (Sezione 4) DEFAULT ROUTE  ************************* */
// Default route
app.use('/', function (req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
		//req["connessione"].close();
    }
    else  
		res.send(paginaErrore);
});


// Gestione degli errori
app.use("/", (err: any, req: any, res: any, next: any) => {
	//if(req["connessione"]) req["connessione"].close();
    res.status(500);
    res.send("ERRR: " + err.message);
    console.log("SERVER ERROR " + err.stack);
});
