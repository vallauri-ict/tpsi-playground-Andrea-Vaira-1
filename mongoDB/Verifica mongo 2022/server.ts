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
  dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});

/***********USER LISTENER****************/

dispatcher.addListener("GET", "/api/elencoClassi", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection.distinct("classe");
    /*.find({ gender })
      .project({ name: 1, gender: 1, hair: 1, weight: 1, loves: 1 })
      .sort({ name: 1 }, 1)
      .toArray();*/
    rq.catch((err: any) => {
      console.log("Errore esecuzione query " + err.message);
    });
    rq.then((data: any) => {
      //console.log(JSON.stringify(data));
      res.writeHead(200, _headers.json);
      res.write(JSON.stringify(data));
      res.end();
    });
    rq.finally(() => {
      // Quando esce dal catch o dal then
      client.close();
    });
  });
});

dispatcher.addListener("GET", "/api/elencoStudenti", (req: any, res: any) => {
  let gender = req.GET.gender;
  let classe = req.GET.classe;

  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection
      .find({ classe, genere: gender })
      .project({ nome: 1, valutazioni: 1 })
      .toArray((err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          //console.log(JSON.stringify(data));
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      });
    /*rq.catch((err: any) => {
      console.log("Errore esecuzione query " + err.message);
    });
    rq.then((data: any) => {
      //console.log(JSON.stringify(data));
      res.writeHead(200, _headers.json);
      res.write(JSON.stringify(data));
      res.end();
    });
    rq.finally(() => {
      // Quando esce dal catch o dal then
      client.close();
    });*/
  });
});

dispatcher.addListener("GET", "/api/es2", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection
      .find({ $or: [{ classe: "5A" }, { classe: "5B" }], assenze: { $gt: 10 } })
      .project({ nome: 1, classe: 1, nAssenza: 1, _id: 0 })
      .toArray((err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      });
  });
});

dispatcher.addListener("GET", "/api/es3", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection
      .find({})
      .sort({ assenze: -1 })
      .limit(3)
      .project({ nome: 1, classe: 1, nAssenza: 1, _id: 0 })
      .toArray((err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      });
  });
});

dispatcher.addListener("GET", "/api/es4", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection.updateOne(
      { nome: "Flaminia", classe: "5A" },
      { $inc: { assenze: 1 } },
      (err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      }
    );
  });
});

dispatcher.addListener("GET", "/api/es5", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");

    let rq = collection
      .find({
        $or: [{ classe: "5A" }, { classe: "5B" }],
        valutazioni: { $elemMatch: { disciplina: "informatica", voto: 9 } },
      })
      .project({ nome: 1, classe: 1, "valutazioni.data.$": 1, _id: 0 })
      .toArray((err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      });
  });
});

dispatcher.addListener("GET", "/api/es6", (req: any, res: any) => {
  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("valutazioni");
    let rq = collection.updateOne(
      { nome: "Piero", classe: "4A" },
      {
        $push: {
          valutazioni: { disciplina: "informatica", voto: 7, data: new Date() },
        },
      },
      (err: any, data: any) => {
        if (err) {
          console.log("Errore esecuzione query " + err.message);
        } else {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify(data));
          res.end();
        }
      }
    );
  });
});
