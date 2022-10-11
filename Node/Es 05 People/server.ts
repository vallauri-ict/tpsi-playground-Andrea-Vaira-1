import _http from "http";
import _url from "url";
import _fs from "fs";
import _dispatcher from "./dispatcher";
import _headers from "./headers.json";
import dispatcher from "./dispatcher";

const PORT = 1337;

let people: any;

let server = _http.createServer((req, res) => {
  // Cerca il listener opportuno e lo manda in esecuzione
  _dispatcher.dispatch(req, res);
});

server.listen(PORT, () => {
  loadPeople();
  console.log("Server in ascolto sulla porta " + PORT);
});

let loadPeople = () => {
  _fs.readFile("./people.json", (err, data) => {
    if (err) {
      throw new Error("file non trovato");
    } else {
      people = JSON.parse(data.toString());
    }
  });
};

/*******CREAZIONE DEI LISTENER******/
_dispatcher.addListener("GET", "/api/nazioni", (req: any, res: any) => {
  res.writeHead(200, _headers.json);
  let data: string[] = [];
  for (const item of people.results) {
    if (!data.includes(item.location.country)) {
      data.push(item.location.country);
    }
  }
  data.sort();
  res.write(JSON.stringify({ ris: data }));
  res.end();
});

_dispatcher.addListener("POST", "/api/people", (req: any, res: any) => {
  let results: any[] = [];
  for (const item of people.results) {
    if (item.location.country == req.BODY.country) {
      let person = getPerson(item);
      results.push(person);
    }
  }
  res.writeHead(200, _headers.json);
  res.write(JSON.stringify(results));
  res.end();
});

let getPerson = (item: any) => {
  return {
    name: `${item.name.title} ${item.name.first} ${item.name.last}`,
    city: `${item.location.city}`,
    state: `${item.location.state}`,
    cell: `${item.cell}`,
  };
};

dispatcher.addListener("POST", "/api/details", (req: any, res: any) => {
  let personSearch = JSON.stringify(req.BODY.person);
  let result: any | undefined = undefined;
  for (const person of people.results) {
    let str = JSON.stringify(getPerson(person));
    if (str == personSearch) {
      result = person;
    }
  }
  if (result == undefined) {
    res.writeHead(404, _headers.text);
    res.write("Record non trovato");
  } else {
    res.writeHead(200, _headers.json);
    res.write(JSON.stringify(result));
  }
  res.end();
});

dispatcher.addListener("POST", "/api/delete", (req: any, res: any) => {
  let personSearch = JSON.stringify(req.BODY.person);
  for (const person of people) {
    let str = JSON.stringify(getPerson(person));
    if (str == personSearch) {
    }
  }
});
