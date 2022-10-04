import _http from "http";
import _url from "url";
import _fs from "fs";
import _mime from "mime";
import _queryString from "querystring";

let paginaErrore: string;

export class Dispatcher {
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

  addListener(method: string, resource: string, callback: any) {
    method = method.toUpperCase();
    if (method in this.listeners) {
      this.listeners[method][resource] = callback;
    } else {
      throw new Error("Metodo non valido");
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
