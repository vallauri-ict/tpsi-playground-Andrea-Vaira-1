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

dispatcher.addListener("GET", "/api/unicorns", (req: any, res: any) => {
  let gender = req.GET.gender;

  let conn1 = MongoClient.connect(connectionString);
  conn1.catch((err) => {
    res.writeHead(503, _headers.text);
    res.write("Impossibile connettersi DB server");
    res.end();
  });
  conn1.then((client: any) => {
    let collection = client.db(DBNAME).collection("unicorns");
    let rq = collection
      .find({ gender })
      .project({ name: 1, gender: 1, hair: 1, weight: 1, loves: 1 })
      .sort({ name: 1 }, 1)
      .toArray();
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
