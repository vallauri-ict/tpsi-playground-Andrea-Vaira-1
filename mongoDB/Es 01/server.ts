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

// AVVIO DEL SERVER HTTP
/*
let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});*/

/***********USER LISTENER****************/

// Query di selezione
let promise = MongoClient.connect(connectionString);
promise.catch((err: any) => {
  console.log("Errore di connessione al server");
});
promise.then((client: any) => {
  let db = client.db("5b");
  let collection = db.collection("unicorns");
  collection
    .find({ gender: "f", weight: { $gt: 600 } })
    .project({ name: 1, gender: 1, hair: 1, _id: 0 })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("FIND -->", JSON.stringify(data));
      }
      client.close();
    });
});
