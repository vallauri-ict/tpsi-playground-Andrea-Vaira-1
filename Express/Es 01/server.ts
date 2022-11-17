import http from "http";
import url from "url";
import fs from "fs";
import enviroment from "./enviroment.json";
import express from "express";
const app = express();

const PORT = 1337;

// mongoDb
import { MongoClient, ObjectId } from "mongodb";
import { skipPartiallyEmittedExpressions } from "typescript";
const user = enviroment.atlas.user;
const pwd = enviroment.atlas.password;
const connectionString = `mongodb+srv://${user}:${pwd}@cluster0.ieoh65s.mongodb.net/?retryWrites=true&w=majority`;
const connectionStringLocal = "mongodb://localhost:27017";
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
  console.log("---> " + req.method + ": " + req.originalUrl);
  next();
});

// 2 gestione delle risorse statiche
//cerca le risorse nella cartella segnata nel path e li restituisce
app.use("/", express.static("./static"));

// 3 lettura dei parametri POST
app.use("/", express.json());

// 4 log dei parametri get e post
app.use("/", (req: any, res: any, next: any) => {
  // parametri get .query, post .body
  if (Object.keys(req.query).length != 0) {
  }
  if (Object.keys(req.body).length != 0) {
  }
  console.log("---> " + req.method + ": " + req.originalUrl);
  next();
});

/***********USER LISTENER****************/

/***********DEFAULT ROUTE****************/
app.use("/", (req: any, res: any, next: any) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("API non disponibile");
  } else {
    res.send(paginaErrore);
  }
});
