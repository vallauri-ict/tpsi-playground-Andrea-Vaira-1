import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";

const PORT = 1337;

let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  console.log("Server in ascolto sulla porta " + PORT);
});

/*******CREAZIONE DEI LISTENER******/
_dispatcher.addListener("GET", "/api/servizio1", (req: any, res: any) => {
  res.writeHead(200, _headers.json);
  let data = { ris: "Benvenuto " + req.GET.nome };
  res.write(JSON.stringify(data));
  res.end();
});

_dispatcher.addListener("POST", "/api/servizio2", (req: any, res: any) => {
  res.writeHead(200, _headers.json);
  let data = { ris: "Benvenuto " };
  res.write(JSON.stringify(data));
  res.end();
});
