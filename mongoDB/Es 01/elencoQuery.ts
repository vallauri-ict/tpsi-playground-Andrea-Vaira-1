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
let conn1 = MongoClient.connect(connectionString);
conn1.catch((err: any) => {
  console.log("Errore di connessione al server");
});
conn1.then((client: any) => {
  let collection = client.db(DBNAME).collection("unicorns");
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

// Query di selezione con promise
let conn2 = MongoClient.connect(connectionString);
conn2.catch((err) => {
  console.log("Errore connesione al database");
});
conn2.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let query = { $and: [{ gender: "f" }, { loves: "apple" }] };
  let rq = collection
    .find(query)
    .project({ name: 1, loves: 1, _id: 0 })
    .sort({ name: 1 }) // ordinamento crescente sul campo name, -1 sarebbe decrescente
    .toArray();
  rq.catch((err) => {
    console.log("Errore esecuzione query " + err.message);
  });
  rq.then((data) => {
    console.log("FIND -->", JSON.stringify(data));
  });
  rq.finally(() => {
    // Quando esce dal catch o dal then
    client.close();
  });
});

// Query di Insert
let conn3 = MongoClient.connect(connectionString);
conn3.catch((err) => {
  console.log("Errore di connesione");
});
conn3.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let unicorn = {
    name: "Pippo",
    loves: ["grapes", "watermelon"],
    weight: 704,
    gender: "m",
  };
  let rq = collection.insertOne(unicorn);
  rq.catch((err) => {
    console.log("Errore query " + err.message);
  });
  rq.then((data: any) => {
    console.log("INSERT --> " + JSON.stringify(data));
  });
  rq.finally(() => {
    client.close();
  });
});

// Query UPDATE
let conn4 = MongoClient.connect(connectionString);
conn4.catch((err) => {
  console.log("Errore di connesione");
});
conn4.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  // Sel il campo non esiste lo crea, altrimenti lo sovrascrive
  let rq = collection.updateOne({ name: "Pippo" }, { $set: { vampires: 100 } });
  rq.catch((err) => {
    console.log("Errore query " + err.message);
  });
  rq.then((data) => {
    console.log("UPDATE --> " + JSON.stringify(data));
  });
  rq.finally(() => {
    client.close();
  });
});

// Query DELETE
let conn5 = MongoClient.connect(connectionString);
conn5.catch((err) => {
  console.log("Errore di connesione");
});
conn5.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let rq = collection.deleteMany({ name: "Pippo" });
  rq.catch((err) => {
    console.log("Errore query " + err.message);
  });
  rq.then((data) => {
    console.log("DELETE --> " + JSON.stringify(data));
  });
  rq.finally(() => {
    client.close();
  });
});

// Conteggio dei record
let conn6 = MongoClient.connect(connectionString);
conn6.catch((err) => {
  console.log("Errore di connesione");
});
conn6.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let rq = collection.countDocuments({ gender: "m", weight: { $gt: 700 } });
  rq.catch((err) => {
    console.log("Errore query " + err.message);
  });
  rq.then((data) => {
    console.log("COUNTS --> " + JSON.stringify(data));
  });
  rq.finally(() => {
    client.close();
  });
});

// DISTINCT
let conn7 = MongoClient.connect(connectionString);
conn7.catch((err) => {
  console.log("Errore di connesione");
});
conn7.then((client) => {
  let collection = client.db(DBNAME).collection("unicorns");
  let rq = collection.distinct("hair", { gender: "m" });
  rq.catch((err) => {
    console.log("Errore query " + err.message);
  });
  rq.then((data) => {
    console.log("DISTINCT --> " + JSON.stringify(data));
  });
  rq.finally(() => {
    client.close();
  });
});
