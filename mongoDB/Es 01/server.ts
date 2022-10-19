import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";
import dispatcher from "./dispatcher";
const PORT = 1337;

// mongoDb
import { MongoClient } from "mongodb";
const connectionString = "mongodb://localhost:27017";
const DBNAME = "5b";

// AVVIO DEL SERVER HTTP

let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});

/***********USER LISTENER****************/
