import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";
import _mime from "mime";
import _notizie from "./news.json";

const PORT = 1337;

let notizie: any = _notizie;

let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  //loadStates();
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});

/*******CREAZIONE DEI LISTENER******/
_dispatcher.addListener("GET", "/api/elenco", (req: any, res: any) => {
  res.writeHead(200, _headers.json);
  res.write(JSON.stringify(notizie));
  res.end();
});

_dispatcher.addListener("POST", "/api/dettagli", (req: any, res: any) => {
  let param = req.BODY.titoloNotizia;

  for (const not of notizie) {
    if (not.titolo == param) {
      let resource = "./news/" + not.file;
      _fs.readFile(resource, (err, data) => {
        if (!err) {
          res.writeHead(200, _headers.json);
          res.write(JSON.stringify({ file: data.toString() }));
          not.visualizzazioni = parseInt(not.visualizzazioni) + 1;
          /*_fs.writeFile(resource, notizie, () => {
            console.log("File aggiornato correttamente");
          });*/
        } else {
          res.writeHead(404, _headers.text);
          res.write("File not found");
        }
        res.end();
      });
      break;
    }
  }
});
