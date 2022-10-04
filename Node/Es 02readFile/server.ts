"use strict";
import _http from "http";
import _url from "url";
import _fs from "fs";
import _mime from "mime"; // non ha l'interfaccia ts
import _headers from "./headers.json";

const PORT: number = 1337;
let paginaErrore: string;

//const server = _http.createServer(function(req:_http.IncomingMessage, res:_http.ServerResponse) {
const server = _http.createServer(function (req, res) {
  let method: string = req.method;
  let url = _url.parse(req.url, true); // con true parsifica anche i parametri
  let resource: string = url.pathname;
  let parameters = url.query;
  console.log(
    `Richiesta ${method}: ${resource}, ${JSON.stringify(parameters)}`
  );

  if (resource == "/") {
    resource = "/index.html";
  }
  if (!resource.startsWith("/api/")) {
    // Risorsa statica
    resource = "./static" + resource;
    _fs.readFile(resource, (err, data) => {
      if (!err) {
        let header = { "Content-Type": _mime.getType(resource) };
        res.writeHead(200, header);
        res.write(data);
        res.end();
      } else {
        res.writeHead(404, _headers.html);
        res.write(paginaErrore);
        res.end();
      }
    });
  } else {
    //Risorsa dinamica --> dati
    if (resource == "/api/servizio1") {
      let response = {
        ris: "ok",
        benvenuto: parameters.nome,
      };
      res.writeHead(200, _headers.json);
      res.write(JSON.stringify(response));
      res.end();
    } else {
      res.writeHead(404, _headers.text);
      res.write("Servizio non disponibile");
      res.end();
    }
  }
});

server.listen(PORT, function () {
  console.log("Server in ascolto sulla porta: " + PORT);

  _fs.readFile("./static/error.html", (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h3>RISORSA NON TROVATA</h3>";
    }
  });
});
