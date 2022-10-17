import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";
import radios from "./radios.json";
import _mime from "mime";
import converter from "image-to-base64";

const PORT = 1337;

let states: any;

let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  loadStates();
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  loadStates();
  console.log("Server in ascolto sulla porta " + PORT);
});

let loadStates = () => {
  _fs.readFile("./states.json", (err, data) => {
    if (err) {
      throw new Error("file non trovato");
    } else {
      states = JSON.parse(data.toString());
    }
  });
};

/*******CREAZIONE DEI LISTENER******/
_dispatcher.addListener("GET", "/api/elenco", (req: any, res: any) => {
  res.writeHead(200, _headers.json);
  res.write(JSON.stringify(states));
  res.end();
});

_dispatcher.addListener("GET", "/api/radios", (req: any, res: any) => {
  let regione = req.GET.state;
  let radiosResearched: any[] = [];
  for (const radio of radios) {
    if (radio.state == regione) {
      radiosResearched.push(radio);
    }
  }
  res.writeHead(200, _headers.json);
  res.write(JSON.stringify(radiosResearched));
  res.end();
});

_dispatcher.addListener("GET", "/like.jpg", (req: any, res: any) => {
  let resource = "./static/like.jpg";
  /*_fs.readFile(resource, (err, data) => {
    if (!err) {
      //let header = { "Content-Type": _mime.getType(resource) };
      res.writeHead(200, _headers.image);

      //let img = btoa(data.toString());
      res.write(data);
      res.end();
    } else {
      res.writeHead(404, _headers.html);
      res.write("File not found");
      res.end();
    }
  });*/
});
