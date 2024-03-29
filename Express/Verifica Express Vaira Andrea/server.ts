import http from "http";
import url from "url";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";
import express from "express";
import fileUpload from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";

// config
const PORT = 1337;
dotenv.config({ path: ".env" });
const app = express();
const connectionString: any = process.env.connectionString;
const DBNAME = "5b";
cloudinary.v2.config(JSON.parse(process.env.cloudinary as string));
//CREAZIONE E AVVIO DEL SERVER HTTP
let server = http.createServer(app);
let paginaErrore: string = "";

server.listen(PORT, () => {
  init();
  console.log("Server in ascolto sulla porta " + PORT);
});

function init() {
  fs.readFile("./static/error.html", (err: any, data: any) => {
    if (err) {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    } else {
      paginaErrore = data.toString();
    }
  });
}

/***********MIDDLEWARE****************/
// 1 request log
app.use("/", (req: any, res: any, next: any) => {
  console.log(req.method + ": " + req.originalUrl);
  next();
});

// 2 gestione delle risorse statiche
//cerca le risorse nella cartella segnata nel path e li restituisce
app.use("/", express.static("./static"));

// 3 lettura dei parametri POST
app.use("/", express.json({ limit: "20mb" }));
app.use("/", express.urlencoded({ limit: "20mb", extended: true }));

// 4 log dei parametri get e post
app.use("/", (req: any, res: any, next: any) => {
  // parametri get .query, post .body
  if (Object.keys(req.query).length != 0) {
    console.log("---> Parametri GET: " + JSON.stringify(req.query));
  }
  if (Object.keys(req.body).length != 0) {
    console.log("---> Parametri BODY: " + JSON.stringify(req.body));
  }
  next();
});

// 5 Upload dei file binari
app.use("/", fileUpload({ limits: { fileSize: 20 * 1024 * 1024 } })); // 20 MB

// Apertura della connessione
app.use("/api/", (req: any, res: any, next: any) => {
  let connection = new MongoClient(connectionString);
  connection
    .connect()
    .catch((err: any) => {
      res.status(503);
      res.send("Errore di connessione al DB");
    })
    .then((client: any) => {
      req["connessione"] = client;
      next();
    });
});

/***********USER LISTENER****************/

app.post("/api/aggiungiDomanda", (req: any, res: any, next: any) => {
  if (
    !req.files.image ||
    !req.body.domanda ||
    !req.body.risposte ||
    !req.body.checkValue
  ) {
    res.status(404);
    res.send("File or username is missed");
  } else {
    // salvo tutta l'immagine su disco base64
    let image = req.files.image;
    image.mv("./static/img/" + image.name, (err: any) => {
      if (err) {
        res.status(500);
        res.send(err.message);
      } else {
        // scrivo il nome dell'immagine nel db
        let record = {
          domanda: req.body.domanda,
          img: req.files.image.name,
          risposte: req.body.risposte.split(","),
          correct: parseInt(req.body.checkValue),
        };
        let collection = req["connessione"].db(DBNAME).collection("automobili");
        collection.insertOne(record, (err: any, data: any) => {
          if (err) {
            res.status(500);
            res.send("Errore inserimento record");
          } else {
            res.send(data);
          }
          req["connessione"].close();
        });
      }
    });
  }
});

app.get("/api/elencoDomande", (req: any, res: any, next: any) => {
  let collection = req["connessione"].db(DBNAME).collection("automobili");
  collection.find().toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      res.send(data);
    }
    req["connessione"].close();
  });
});

app.post("/api/risposte", (req: any, res: any, next: any) => {
  console.log(req.body.risposte);
  let collection = req["connessione"].db(DBNAME).collection("automobili");
  /*collection.find().toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      let promise = verificaRisposte(data, req.body.risposte);
      promise.then((ris: any) => {
        res.send(ris);
      });
      promise.catch((err: any) => {
        res.status(500);
        res.send("Errore");
      });
    }
    req["connessione"].close();
  });*/

  let promises = [];
  for (const item of req.body.risposte) {
    let _id = new ObjectId(item.id);
    let promise = collection.findOne({ _id: _id });
    promises.push(promise);
  }
  Promise.all(promises)
    .then((questions) => {
      // richiamato quando tutte le promise del vettore hanno finito
      // l'ordine del vettore question è lo stesso identico di come sono state lanciate le richeste
      let voto = 0;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].correct == req.body.risposte[i].indiceRisposta) {
          voto++;
        } else {
          voto = voto - 0.25;
        }
      }
      res.send({ ris: voto });
      req["connessione"].close();
    })
    .catch((err) => {
      res.status(500);
      res.send("Errore");
      req["connessione"].close();
    });
});

async function verificaRisposte(data: any, risposte: any) {
  let cont = 0;
  for (const risposta of data) {
    for (const rispostaUtente of risposte) {
      if (risposta._id == rispostaUtente.id) {
        if (risposta.correct == rispostaUtente.indiceRisposta) {
          cont++;
        } else {
          (cont = cont - 0), 25;
        }
      }
    }
  }
  return { ris: cont };
}

app.post("/api/login", (req: any, res: any, next: any) => {
  let username = req.body.username;
  let password = req.body.password;

  let collection = req["connessione"].db(DBNAME).collection("mail");

  collection.find({ username, password }).toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      if (data.length == 0) {
        res.status(401);
        res.send("Username o password errati");
      } else {
        res.status(200);
        res.send({ ris: "ok" });
      }
    }
    req["connessione"].close();
  });
});

app.get("/api/mails", (req: any, res: any, next: any) => {
  let username = req.query.username;
  let password = req.query.password;

  let collection = req["connessione"].db(DBNAME).collection("mail");

  collection
    .find({ username, password })
    .project({ mail: 1, username: 1, _id: 0 })
    .toArray((err: any, data: any) => {
      if (err) {
        res.status(500);
        res.send("Errore esecuzione query");
      } else {
        if (data.length == 0) {
          res.status(401);
          res.send("Username o password errati");
        } else {
          res.status(200);
          res.send(data);
        }
      }
      req["connessione"].close();
    });
});

app.post("/api/findUser", (req: any, res: any, next: any) => {
  let username = req.body.username;

  console.log(username);
  let collection = req["connessione"].db(DBNAME).collection("mail");

  collection.find({ username }).toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      if (data.length == 0) {
        res.status(401);
        res.send("Username non trovato");
      } else {
        res.status(200);
        res.send({ ris: "ok" });
      }
    }
    req["connessione"].close();
  });
});

app.post("/api/sendMail", (req: any, res: any, next: any) => {
  if (req.files) {
    let image = req.files.image;
    image.mv("./static/img/" + image.name, (err: any) => {
      if (err) {
        res.status(500);
        res.send(err.message);
      } else {
        // scrivo il nome dell'immagine nel db
        let record = {
          from: req.body.from,
          subject: req.body.subject,
          body: req.body.message,
          attachment: image.name,
        };
        updateRecord(record, req, res);
      }
    });
  } else {
    let record = {
      from: req.body.from,
      subject: req.body.subject,
      body: req.body.message,
    };
    updateRecord(record, req, res);
  }

  function updateRecord(record: any, req: any, res: any) {
    let collection = req["connessione"].db(DBNAME).collection("mail");
    collection.updateOne(
      { username: req.body.to },
      { $push: { mail: record } },
      (err: any, data: any) => {
        if (err) {
          res.status(500);
          res.send("Errore esecuzione query");
        } else {
          res.status(200);
          res.send({ ris: "ok" });
        }
        req["connessione"].close();
      }
    );
  }
});

app.get("/api/images", (req: any, res: any, next: any) => {
  let collection = req["connessione"].db(DBNAME).collection("images");

  collection.find().toArray((err: any, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore lettura connesioni");
    } else {
      res.send(data);
    }
    req["connessione"].close();
  });
});

app.post("/api/binaryUpload", (req: any, res: any, next: any) => {
  // l'immagine la recupera in req.files
  if (!req.body.username || !req.files || Object.keys(req.files).length == 0) {
    res.status(404);
    res.send("Username or file is missing");
  } else {
    let username = req.body.username;
    let image = req.files.image;

    // gli assegno il path della cartella e salvo il file
    image.mv("./static/img/" + image.name, (err: any) => {
      if (err) {
        res.status(500);
        res.send(err.message);
      } else {
        // scrivo il nome dell'immagine nel db
        let record = {
          username,
          img: image.name,
        };
        let collection = req["connessione"].db(DBNAME).collection("images");
        collection.insertOne(record, (err: any, data: any) => {
          if (err) {
            res.status(500);
            res.send("Errore inserimento record");
          } else {
            res.send(data);
          }
          req["connessione"].close();
        });
      }
    });
  }
});

app.post("/api/base64Upload", (req: any, res: any, next: any) => {
  //prenod i parametri post
  if (!req.body.username || !req.body.img) {
    res.status(404);
    res.send("File or username is missed");
  } else {
    // salvo tutta l'immagine su disco base64
    let record = {
      username: req.body.username,
      img: req.body.img,
    };
    let collection = req["connessione"].db(DBNAME).collection("images");
    collection.insertOne(record, (err: any, data: any) => {
      if (err) {
        res.status(500);
        res.send("Errore inserimento record");
      } else {
        res.send(data);
      }
      req["connessione"].close();
    });
  }
});

app.post("/api/base64Cloudinary", (req: any, res: any, next: any) => {
  if (!req.body.username || !req.body.img) {
    res.status(404);
    res.send("File or username is missed");
  } else {
    cloudinary.v2.uploader
      .upload(req.body.img, { folder: "myImages" })
      .then((result: UploadApiResponse) => {
        let record = {
          username: req.body.username,
          img: result.secure_url,
        };
        let collection = req["connessione"].db(DBNAME).collection("images");
        collection.insertOne(record, (err: any, data: any) => {
          if (err) {
            res.status(500);
            res.send("Errore inserimento record");
          } else {
            res.send(data);
          }
          req["connessione"].close();
        });
      })
      .catch((err: any) => {
        res.status(500);
        res.send("Error upload file to Cloudinary. Error: " + err.message);
      });
  }
});

app.post("/api/binaryCloudinary", (req: any, res: any, next: any) => {
  // l'immagine la recupera in req.files
  if (!req.body.username || !req.files || Object.keys(req.files).length == 0) {
    res.status(404);
    res.send("Username or file is missing");
  } else {
    let username = req.body.username;
    let image = req.files.image;
    let path = "./static/img/" + image.name;

    // gli assegno il path della cartella e salvo il file
    image.mv(path, (err: any) => {
      if (err) {
        res.status(500);
        res.send(err.message);
      } else {
        //salvo su Cloudinary
        cloudinary.v2.uploader
          .upload(path, {
            folder: "myImages",
            use_filename: true, // mantiene il nome del file così com'è
          })
          .then((result: UploadApiResponse) => {
            // scrivo il nome dell'immagine nel db
            let record = {
              username: req.body.username,
              img: result.secure_url,
            };
            let collection = req["connessione"].db(DBNAME).collection("images");
            collection.insertOne(record, (err: any, data: any) => {
              if (err) {
                res.status(500);
                res.send("Errore inserimento record");
              } else {
                res.send(data);
              }
              req["connessione"].close();
            });
          })
          .catch((err: any) => {
            res.status(500);
            res.send("Error upload file to Cloudinary. Error: " + err.message);
          });
      }
    });
  }
});

/***********DEFAULT ROUTE****************/

app.use("/", (req: any, res: any, next: any) => {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("API non disponibile");
    req["connessione"].close();
  } else {
    res.send(paginaErrore);
  }
});

app.use("/", (err: any, req: any, res: any, next: any) => {
  if (req["connessione"]) {
    req["connessione"].close();
  }
  console.log("SERVER ERROR " + err.stack);
  res.status(500);
  res.send(err.message);
});
