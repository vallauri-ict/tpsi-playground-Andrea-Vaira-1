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
/*
let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});*/

/***********USER LISTENER****************/

// Query di selezione con callback
let client: any;

let conn1 = MongoClient.connect(connectionString);
conn1.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn1.then((_client: any) => {
  client = _client;
  let collection = client.db(DBNAME).collection("unicorns");
  collection
    .find({ gender: "f", weight: { $gt: 600 } }) // Il find è ASINCRONO
    .project({ name: 1, gender: 1, hair: 1, _id: 0 })
    .toArray((err: any, data: any) => {
      if (err) {
        console.log("Errore esecuione query " + err.message);
      } else {
        console.log("FIND -->", JSON.stringify(data));
      }
    });

  let query = { $and: [{ gender: "f" }, { loves: "apple" }] };
  let rq = collection
    .find(query)
    .project({ name: 1, loves: 1, _id: 0 })
    .sort({ name: 1 }) // ordinamento crescente sul campo name, -1 sarebbe decrescente
    .toArray();
  rq.catch((err: any) => {
    console.log("Errore esecuzione query " + err.message);
  });
  rq.then((data: any) => {
    console.log("FIND -->", JSON.stringify(data));
  });
});
conn1.finally(() => {
  client.close();
});
