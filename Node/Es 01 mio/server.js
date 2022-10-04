"use strict";

const _http = require("http");
const _url = require("url");
const _colors = require("colors");
const port = 2020; // default port 1337
const server = _http.createServer(function (req, res) {
  let metodo = req.method;
  // parsing della url ricevuta dal client. Senza il true i param vengono restituiti in url-encoded
  let url = _url.parse(req.url, true);
  let risorsa = url.pathname;
  let param = url.query;
  let dominio = req.headers.host;
  res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  res.write("<h1> Informazioni relative alla Richiesta ricevuta</h1>");
  res.write("<br>");
  res.write(`<p> Risorsa richiesta : ${risorsa} </p>`); // alt 96
  res.write(`<p> Metodo : ${metodo}</p>`);
  res.write(`<p> Parametri : ${JSON.stringify(param)}</p>`);
  res.write(`<p> Dominio richiesto : ${dominio}</p>`);
  res.end();
  console.log("Richiesta Ricevuta : " + url.path.yellow); // risorsa + parametri
});
// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);
console.log("server in ascolto sulla porta " + port);
