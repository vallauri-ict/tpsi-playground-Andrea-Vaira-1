import http from "http";
import url from "url";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
const app = express();

const PORT = 1337;

// mongoDb
import { MongoClient, ObjectId } from "mongodb";
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
app.get("/api/richiesta1", (req: any, res: any, next: any) => {
  if (!req.query.nome) {
    res.status(500);
    res.send("Parametro nome mancante");
    req.client.close();
  } else {
    let collection = req.client.db(DBNAME).collection("unicorns");
    collection.findOne({ name: req.query.nome }, (err: any, data: any) => {
      if (err) {
        res.status(500);
        res.send("Errore esecuzione query");
      } else {
        res.send(data);
      }
      req.client.close();
    });
  }
});

app.patch("/api/richiesta2", (req: any, res: any, next: any) => {
  let unicorn = req.body.nome;
  let nVampires = req.body.nVampiri;

  if (!unicorn) {
    res.status(500);
    res.send("Parametro nome mancante");
    req.client.close();
  } else {
    let collection = req.client.db(DBNAME).collection("unicorns");
    collection.updateOne(
      { name: unicorn },
      { $inc: { vampires: nVampires } },
      (err: any, data: any) => {
        if (err) {
          res.status(500);
          res.send("Errore esecuzione query");
        } else {
          res.send(data);
        }
        req.client.close();
      }
    );
  }
});

app.get(
  "/api/richiestaParams/:gender/:hair",
  (req: any, res: any, next: any) => {
    let gender = req.params.gender;
    let hair = req.params.hair;

    let collection = req.client.db(DBNAME).collection("unicorns");
    collection.find({ gender, hair }).toArray((err: any, data: any) => {
      if (err) {
        res.status(500);
        res.send("Errore esecuzione query");
      } else {
        res.send(data);
      }
      req.client.close();
    });
  }
);
/***********DEFAULT ROUTE****************/

app.use("/", (req: any, res: any, next: any) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("API non disponibile");
  } else {
    res.send(paginaErrore);
  }
});

app.use("/", (err: any, req: any, res: any, next: any) => {
  console.log("SERVER ERROR " + err.stack);
  res.status(500);
  res.send(err.message);
});
