import _http from "http";
import _url from "url";
import _fs from "fs";
import _mime from "mime";
import _queryString from "query-string";
import _header from "./headers.json";

let paginaErrore: string;

class Dispatcher {
  prompt: string = ">>> ";
  listeners: any = {
    GET: {
      /* "risorsa1":"callback1", "risorsa2":"callback2" */
    },
    POST: {},
    DELETE: {},
    PUT: {},
    PATCH: {},
  };
  constructor() {
    init();
  }

  public addListener(method: string, resource: string, callback: any) {
    method = method.toUpperCase();
    if (method in this.listeners) {
      //Registrazione del nuovo listener
      this.listeners[method][resource] = callback;
    } else {
      throw new Error("Metodo non valido");
    }
  }

  public dispatch(req: any, res: any) {
    let method: string = req.method.toUpperCase();
    if (method == "GET") {
      this.innerDispatch(req, res);
    } else {
      let parameters: string = "";
      req.on("data", (data: any) => {
        parameters += data;
      });
      req.on("end", () => {
        let json: object;
        if (req.headers["content-type"].includes("json")) {
          // JSON
          json = JSON.parse(parameters);
        } else {
          // url encoded
          json = _queryString.parse(parameters);
        }
        req.BODY = json;
        this.innerDispatch(req, res);
      });
    }
  }

  private innerDispatch(req: any, res: any) {
    let method: string = req.method.toUpperCase();
    let url: any = _url.parse(req.url, true);
    let resource: string = url.pathname;
    let parameters: any = url.query;

    req.GET = parameters;

    console.log(
      this.prompt + method + ":" + resource + " " + JSON.stringify(req.GET)
    );

    if (req.BODY && JSON.stringify(req.BODY) != "{}") {
      console.log(`        Body: ${JSON.stringify(req.BODY)}`);
    }

    if (!resource.startsWith("/api/")) {
      staticiListener(req, res, resource);
    } else {
      if (method in this.listeners && resource in this.listeners[method]) {
        // this.listeners[method][resource]();  va in esecuzione la callback corrispondente
        // stessa cosa ma su due righe
        let callback = this.listeners[method][resource];
        callback(req, res);
      } else {
        res.writeHead(404, _header.text);
        res.write("Servizio non disponibile");
        res.end();
      }
    }
  }
}
let init = () => {
  _fs.readFile("./static/error.html", (err, data) => {
    if (!err) {
      paginaErrore = data.toString();
    } else {
      paginaErrore = "<h3>Pagina non trovata</h3>";
    }
  });
};
let staticiListener = (req: any, res: any, resource: string) => {
  if (resource == "/") {
    resource = "/index.html";
  }
  let filename = "./static" + resource;
  _fs.readFile(filename, (err: any, data: any) => {
    if (!err) {
      let header = { "Content-Type": _mime.getType(filename) };
      res.writeHead(200, header);
      res.write(data);
      res.end();
    } else {
      res.writeHead(404, _header.html);
      res.write(paginaErrore);
      res.end();
    }
  });
};

// Creiamo ed esportiamo l'istanza
export default new Dispatcher();
