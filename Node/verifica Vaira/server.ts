"use strict";

import http from "http";
import url from "url";
import fs from "fs";

import dispatcher from "./dispatcher";
import HEADERS from "./headers.json";
import facts from "./facts.json";
import { json } from "stream/consumers";
import { GeneratedIdentifierFlags, NumericLiteral } from "typescript";
import { getEnabledCategories } from "trace_events";

/* ********************** */

// const categories = []
let categories: any[] /* = [
  "career",
  "money",
  "explicit",
  "history",
  "celebrity",
  "dev",
  "fashion",
  "food",
  "movie",
  "music",
  "political",
  "religion",
  "science",
  "sport",
  "animal",
  "travel",
]*/;

const icon_url = "https://assets.chucknorris.host/img/avatar/chuck-norris.png";
const api_url = "https://api.chucknorris.io";

const base64Chars = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "-",
  "_",
];

const PORT = 1337;

let server = http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  //loadStates();
  dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  getCategories();
  console.log("Server in ascolto sulla porta " + PORT);
});

function getCategories() {
  let myCategories: any[] = [];
  for (const fact of facts.facts) {
    for (const cat of fact.categories) {
      if (!myCategories.includes(cat)) {
        myCategories.push(cat);
      }
    }
  }
  categories = myCategories;
}

/*******CREAZIONE DEI LISTENER******/
dispatcher.addListener("GET", "/api/categories", (req: any, res: any) => {
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify({ categories }));
  res.end();
});

dispatcher.addListener("GET", "/api/facts", (req: any, res: any) => {
  let category = req.GET.category;
  let vetFacts: any[] = [];
  for (const fact of facts["facts"]) {
    if (fact["categories"].includes(category)) vetFacts.push(fact);
  }
  res.writeHead(200, HEADERS.json);
  res.write(JSON.stringify({ vetFacts }));
  res.end();
});

dispatcher.addListener("POST", "/api/rate", (req: any, res: any) => {
  let ids: any[] = req.BODY.ids;

  for (const id of ids) {
    for (const item of facts["facts"]) {
      if (item.id == id) {
        item.score++;
      }
    }
  }
  console.log(facts.toString());
  let text = JSON.stringify(facts);
  fs.writeFile("./facts.json", text, (err: any) => {
    if (!err) {
      res.writeHead(200, HEADERS.json);
      res.write(JSON.stringify({ ris: "Ok" }));
      res.end();
    }
  });
});

dispatcher.addListener("POST", "/api/add", (req: any, res: any) => {
  let cat = req.BODY.categoria;
  let val = req.BODY.value;
  let id = generaID();
  let fact = {
    categories: [cat],
    value: val,
    created_at: Date.now().toString(),
    url: api_url,
    icon_url: icon_url,
    score: 0,
    id: id,
    updated_at: Date.now().toString(),
  };
  facts.facts.push(fact);
  let text = JSON.stringify(facts);
  fs.writeFile("./facts.json", text, (err: any) => {
    if (!err) {
      res.writeHead(200, HEADERS.json);
      res.write(JSON.stringify({ ris: "Ok" }));
      res.end();
    }
  });
});

function generaID() {
  let trovato: boolean = false;
  let str;
  do {
    str = "";
    for (let index = 0; index < 22; index++) {
      let n = generaNumero(0, base64Chars.length - 1);
      str += base64Chars[n];
    }
    trovato = false;
    for (const fact of facts.facts) {
      if (fact.id == str) trovato = true;
    }
  } while (trovato);

  return str;
}

function generaNumero(a: number, b: number) {
  return Math.floor((b - a + 1) * Math.random()) + a;
}
