import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";
import dispatcher from "./dispatcher";
const PORT = 1337;

// mongoDb
import { MongoClient, ObjectId } from "mongodb";
//const connectionString =
//  "mongodb+srv://admin:admin@cluster0.ieoh65s.mongodb.net/?retryWrites=true&w=majority";
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

dispatcher.addListener("POST", "/api/AggiungiPippo", (req: any, res: any) => {
  let pippo = {
    name: req.BODY.name,
    dob: req.BODY.dob,
    gender: req.BODY.gender,
    loves: req.BODY.loves,
    weigth: req.BODY.weight,
  };

  let conn = MongoClient.connect(connectionString);
  conn.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn.then((client: any) => {
    let collection = client.db(DBNAME).collection("unicorns");
    collection.insertOne(pippo, (err: any, data: any) => {
      if (err) {
        console.log("Errore esecuzione query " + err.message);
      } else {
        //console.log("QUERY 3 -->", data);
        res.writeHead(200, _headers.json);
        res.write(JSON.stringify(data));
        res.end();
      }
      client.close();
    });
  });
});

dispatcher.addListener("GET", "/api/unicorns", (req: any, res: any) => {
  let gender = req.GET.gender;
  let hair = req.GET.hair;

  let conn = MongoClient.connect(connectionString);
  conn.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn.then((client: any) => {
    let collection = client.db(DBNAME).collection("unicorns");
    if (gender == "") {
      collection
        .find({ hair })
        .project({ name: 1, gender: 1, hair: 1, weight: 1, _id: 0 })
        .toArray((err: any, data: any) => {
          if (err) {
            console.log("Errore esecuzione query " + err.message);
          } else {
            //console.log("QUERY 3 -->", data);
            res.writeHead(200, _headers.json);
            res.write(JSON.stringify(data));
            res.end();
          }
          client.close();
        });
    } else {
      collection
        .find({ $and: [{ gender }, { hair }] })
        .project({ name: 1, gender: 1, hair: 1, weight: 1, _id: 0 })
        .toArray((err: any, data: any) => {
          if (err) {
            console.log("Errore esecuzione query " + err.message);
          } else {
            //console.log("QUERY 3 -->", data);
            res.writeHead(200, _headers.json);
            res.write(JSON.stringify(data));
            res.end();
          }
          client.close();
        });
    }
  });
});
