import http from "http";
import url from "url";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import fileUpload from "express-fileupload";

// config
const PORT = 1337;
dotenv.config({ path: ".env" });
const app = express();
const connectionString: any = process.env.connectionString;
const DBNAME = "5b";

//CREAZIONE E AVVIO DEL SERVER HTTP
let server = http.createServer(app);
let paginaErrore: string = "";

server.listen(PORT, () => {
  init();
  console.log("Server in ascolto sulla porta " + PORT);
});

function init() {
  fs.readFile("./static/error.html", (err: any, data: any) => {
    if (err) {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    } else {
      paginaErrore = data.toString();
    }
  });
}

/***********MIDDLEWARE****************/
// 1 request log
app.use("/", (req: any, res: any, next: any) => {
  console.log(req.method + ": " + req.originalUrl);
  next();
});

// 2 gestione delle risorse statiche
//cerca le risorse nella cartella segnata nel path e li restituisce
app.use("/", express.static("./static"));

// 3 lettura dei parametri POST
app.use("/", express.json({ limit: "50mb" }));
app.use("/", express.urlencoded({ limit: "50mb", extended: true }));

// 4 log dei parametri get e post
app.use("/", (req: any, res: any, next: any) => {
  // parametri get .query, post .body
  if (Object.keys(req.query).length != 0) {
    console.log("---> Parametri GET: " + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length != 0) {
    console.log("---> Parametri BODY: " + JSON.stringify(req.body));
  }
  next();
});

// 5 Upload dei file binari
app.use("/", fileUpload({}));

// Apertura della connessione
app.use("/api/", (req: any, res: any, next: any) => {
  let connection = new MongoClient(connectionString);
  connection
    .connect()
    .catch((err: any) => {
      res.status(503);
      res.send("Errore di connessione al DB");
    })
    .then((client: any) => {
      req["client"] = client;
      next();
    });
});

/***********USER LISTENER****************/
app.get("/api/images", (req: any, res: any, next: any) => {
  let collection = req.client.db(DBNAME).collection("images");

  collection.find().toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore lettura connesioni");
    } else {
      res.send(data);
    }
    req.client.close();
  });
});

app.post("/api/binaryUpload", (req: any, res: any, next: any) => {
  if (!req.body.username || !req.files || Object.keys(req.files).length == 0) {
    res.status(404);
    res.send("Username or file is missing");
  } else {
    let username = req.body.username;
    let image = req.files.image;

    image.mv("./static/img/" + image.name);
  }

  let collection = req.client.db(DBNAME).collection("images");

  collection.find().toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore lettura connesioni");
    } else {
      res.send(data);
    }
    req.client.close();
  });
});

/***********DEFAULT ROUTE****************/

app.use("/", (req: any, res: any, next: any) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("API non disponibile");
    req.client.close();
  } else {
    res.send(paginaErrore);
  }
});

app.use("/", (err: any, req: any, res: any, next: any) => {
  if (req.client) {
    req.client.close();
  }
  console.log("SERVER ERROR " + err.stack);
  res.status(500);
  res.send(err.message);
});
