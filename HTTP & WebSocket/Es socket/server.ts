"use strict";
import http from "http";
import url from "url";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import express from "express";  // @types/express
import cors from "cors"         // @types/cors
import fileUpload, { UploadedFile } from "express-fileupload";
import {Server, Socket} from 'socket.io'; 
import colors from 'colors';

// configurazioni
dotenv.config({ path: ".env" });
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 1337;
const DB_NAME = "5b";
const connectionString:any = process.env.connectionString;

httpServer.listen(PORT, function () {
	console.log("Server in ascolto sulla porta " + PORT)
	init();
  });
  
let paginaErrore = "";
function init() {
fs.readFile("./static/error.html", function (err, data) {
  if (!err) {
	paginaErrore = data.toString();
  }
  else {
	paginaErrore = "<h2>Risorsa non trovata</h2>";
  }
});

/********************************* Middleware ************************* */
  }
  
// 1 request log
app.use("/", (req: any, res: any, next: any) => {
  console.log(req.method + ": " + req.originalUrl);
  next();
});

// 2 gestione delle risorse statiche
app.use("/", express.static("./static"));


// 3 lettura dei parametri POST
// Il limit serve per upload base64
// da express 4.16 (oggi 2022.4.18)
app.use("/", express.json({"limit":"50mb"}))
app.use("/", express.urlencoded({"limit":"50mb", "extended": true }))


// 4 log dei parametri get e post
app.use("/", (req: any, res: any, next: any) => {
  if (Object.keys(req.query).length != 0) {
	  console.log("------> Parametri GET: " + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length != 0) {
	  console.log("------> Parametri BODY: " +JSON.stringify(req.body));
  }
  next();
});


// 6 - CORS Policy
const whitelist = [	];
const corsOptions = {
    origin: function(origin:any, callback:any) {
          return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));


// 7 - per far sì che i json restituiti al client abbiano indentazione 4 chr
app.set("json spaces", 4)


// 10 apertura della connessione
app.use("/api/", function (req:any, res, next) {
	let connection = new MongoClient(connectionString);
    connection.connect()
	.then((client: any) => {
		// req["client"] è un campo esistente !!!!!!!!!!
		req["connessione"]=client;
		next();
	})
	.catch((err: any) => {
		let msg = "Errore di connessione al db"
		res.status(503).send(msg)
	}) 
})


/********************************** REST SERVICES *************************** */

app.get('/api/utenti', function(req:any, res, next) {
	let collection = req["connessione"].db(DB_NAME).collection("images");
	// collection.find({'occupato':false}).toArray(function(err:any, data:any) {
	// 	if (err) {
	// 		res.status(500).send("Errore esecuzione query")
	// 	} 
	// 	else {
	// 		res.send(data);
	// 	}
	// 	req["connessione"].close();
	// })

	// Gestione con la promise
	collection
	.find({ occupato: false })
	.toArray()
	.then((data:any[])=>{
		res.send(data);
	})
	.catch((err:Error)=>{
		res.status(500).send("Errore esecuzione query");
		console.log('Errore: '+err);
	})
	.finally(()=>{
		req["connessione"].close();
	})
}) 




// Default route
app.use('/', function (req:any, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
		req["connessione"].close();
    }
    else  
		res.send(paginaErrore);
});

// Gestione degli errori
app.use("/", (err: any, req: any, res: any, next: any) => {
	console.log(req["connessione"]);
	if(req["connessione"]) req["connessione"].close();
    console.log("SERVER ERROR " + err.stack);
    res.status(500);
    res.send("ERRR: " + err.message);
});




/******************************* gestione web socket *************************** */
let users:any[] = [];

io.on('connection', function (clientSocket:Socket) {
	let user = {} as {username:string, room:string, socket:Socket};
	clientSocket.on('joinRoom', (clientUser)=>{

	})


});



