const _http = require("http");
const _url = require("url");
const _fs = require("fs");
const _colors = require("colors");
const { readFileSync } = require("fs");
const port = 1337;

const server = _http.createServer(function (req, res) {
  let metodo = req.method;
  // parsing della url ricevuta dal client. Senza il true i param vengono restituiti in url-encoded
  let url = _url.parse(req.url, true);
  let risorsa = url.pathname;
  let param = url.query;
  let dominio = req.headers.host;

  console.log("Richiesta Ricevuta : " + risorsa.yellow); // risorsa + parametri

  if (risorsa == "/favicon.ico") {
    // andare a leggere il file
    let icon = _fs.readFileSync("./favicon.ico");
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.write(icon);
    res.end();
  } else {
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.write("<h1> Informazioni relative alla Richiesta ricevuta</h1>");
    res.write("<br>");
    res.write(`<p> Risorsa richiesta : ${risorsa} </p>`); // alt 96
    res.write(`<p> Metodo : ${metodo}</p>`);
    res.write(`<p> Parametri : ${JSON.stringify(param)}</p>`);
    res.write(`<p> Dominio richiesto : ${dominio}</p>`);
    res.end();
  }
});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port, function () {
  console.log("server in ascolto sulla porta " + port);
});
