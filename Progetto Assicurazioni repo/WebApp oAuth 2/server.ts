"use strict";

// import
import http from "http";
import fs from "fs";
import express from "express"; // @types/express
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Double, MongoClient, ObjectId } from "mongodb";
import cors from "cors"; // @types/cors
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// config
const app = express();
const HTTP_PORT = process.env.PORT || 1337;
dotenv.config({ path: ".env" });
const DBNAME = "progetto-assicurazione";
const CONNECTION_STRING = process.env.connectionString;
cloudinary.v2.config(JSON.parse(process.env.cloudinary as string));
const corsOptions = {
  origin: function (origin: any, callback: any) {
    return callback(null, true);
  },
  credentials: true,
};
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const DURATA_TOKEN = 120; // sec

// ***************************** Avvio ****************************************
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, function () {
  init();
  console.log("Server HTTP in ascolto sulla porta " + HTTP_PORT);
});
let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", function (err, data) {
    if (!err) paginaErrore = data.toString();
    else paginaErrore = "<h1>Risorsa non trovata</h1>";
  });
}

/* *********************** (Sezione 2) Middleware ********************* */
// 1. Request log
app.use("/", function (req, res, next) {
  console.log("** " + req.method + " ** : " + req.originalUrl);
  next();
});

// 2 - risorse statiche
app.use("/", express.static("./static"));

// 3 - lettura dei parametri post
app.use("/", express.json({ limit: "20mb" }));
app.use("/", express.urlencoded({ extended: true, limit: "20mb" }));

// 4 - binary upload
app.use(
  "/",
  fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 }, // 20*1024*1024 // 20 M
  })
);

// 5 - log dei parametri
app.use("/", function (req, res, next) {
  if (Object.keys(req.query).length > 0)
    console.log("        Parametri GET: ", req.query);
  if (Object.keys(req.body).length != 0)
    console.log("        Parametri BODY: ", req.body);
  next();
});

// 6. cors
app.use("/", cors(corsOptions));

// 7. gestione login
app.post(
  "/api/login",
  function (req: Request, res: Response, next: NextFunction) {
    let connection = new MongoClient(CONNECTION_STRING as string);
    connection
      .connect()
      .then((client: MongoClient) => {
        const collection = client.db(DBNAME).collection("operatori");
        let regex = new RegExp(`^${req.body.email}$`, "i");
        collection
          .findOne({ email: regex })
          .then((dbUser: any) => {
            if (!dbUser) {
              res.status(401); // user o password non validi
              res.send("User not found");
            } else {
              //confronto la password
              bcrypt.compare(
                req.body.password,
                dbUser.password,
                (err: Error, ris: Boolean) => {
                  if (err) {
                    res.status(500);
                    res.send("Errore bcrypt " + err.message);
                    console.log(err.stack);
                  } else {
                    if (!ris) {
                      // password errata
                      res.status(401);
                      res.send("Wrong password");
                    } else {
                      let token = createToken(dbUser);
                      res.setHeader("authorization", token);
                      // Per permettere le richieste extra domain
                      res.setHeader(
                        "access-control-exspose-headers",
                        "authorization"
                      );
                      res.send({ ris: "ok" });
                    }
                  }
                }
              );
            }
          })
          .catch((err: Error) => {
            res.status(500);
            res.send("Query error " + err.message);
            console.log(err.stack);
          })
          .finally(() => {
            client.close();
          });
      })
      .catch((err: Error) => {
        res.status(503);
        res.send("Database service unavailable");
      });
  }
);

function createToken(user: any) {
  let time: any = new Date().getTime() / 1000;
  let now = parseInt(time); //Data attuale espressa in secondi
  let payload = {
    iat: user.iat || now,
    exp: now + DURATA_TOKEN,
    _id: user._id,
    email: user.email,
  };
  let token = jwt.sign(payload, privateKey);
  console.log("Creato nuovo token " + token);
  return token;
}

// 7 Bis gestione login google
app.post(
  "/api/googleLogin",
  function (req: Request, res: Response, next: NextFunction) {
    let googleToken = req.body.token;
    let googleData: any = jwt.decode(googleToken);
    console.log(googleData, null, 2);

    let connection = new MongoClient(CONNECTION_STRING as string);
    connection
      .connect()
      .then((client: MongoClient) => {
        const collection = client.db(DBNAME).collection("operatori");
        let regex = new RegExp(`^${googleData.email}$`, "i");
        collection
          .findOne({ email: regex })
          .then((dbUser: any) => {
            if (!dbUser) {
              res.status(401); // user o password non validi
              res.send("User not found");
            } else {
              let token = createToken(dbUser);
              res.setHeader("authorization", token);
              // Per permettere le richieste extra domain
              res.setHeader("access-control-exspose-headers", "authorization");
              res.send({ ris: "ok" });
            }
          })
          .catch((err: Error) => {
            res.status(500);
            res.send("Query error " + err.message);
            console.log(err.stack);
          })
          .finally(() => {
            client.close();
          });
      })
      .catch((err: Error) => {
        res.status(503);
        res.send("Database service unavailable");
      });
  }
);

// 8. gestione Logout

// 9. Controllo del Token
app.use("/api", function (req: any, res, next) {
  if (!req.headers["authorization"]) {
    res.status(403);
    res.send("Token mancante");
  } else {
    let token: any = req.headers.authorization;
    jwt.verify(token, privateKey, (err: any, payload: any) => {
      if (err) {
        res.status(403);
        res.send("Token scaduto o corrotto");
      } else {
        let newToken = createToken(payload);
        res.setHeader("authorization", token);
        // Per permettere le richieste extra domain
        res.setHeader("access-control-exspose-headers", "authorization");
        req["payload"] = payload;
        next();
      }
    });
  }
});

// 10. Apertura della connessione
app.use("/api/", function (req: any, res: any, next: NextFunction) {
  let connection = new MongoClient(CONNECTION_STRING as string);
  connection
    .connect()
    .then((client: any) => {
      req["connessione"] = client;
      next();
    })
    .catch((err: any) => {
      let msg = "Errore di connessione al db";
      res.status(503).send(msg);
    });
});

/* ********************* (Sezione 3) USER ROUTES  ************************** */

app.get("/api/perizie", (req: any, res: Response, next: NextFunction) => {
  let collection = req["connessione"].db(DBNAME).collection("perizie");
  collection.find({}).toArray((err: Error, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      res.send(data);
    }
    req["connessione"].close();
  });
});

app.get("/api/perizieUtente", (req: any, res: Response, next: NextFunction) => {
  let collection = req["connessione"].db(DBNAME).collection("perizie");
  collection
    .find({ codOperatore: req.query.codOperatore })
    .toArray((err: Error, data: any) => {
      if (err) {
        res.status(500);
        res.send("Errore esecuzione query");
      } else {
        res.send(data);
      }
      req["connessione"].close();
    });
});

app.get("/api/operatore", (req: any, res: Response, next: NextFunction) => {
  let _id = new ObjectId(req.query._id);
  let collection = req["connessione"].db(DBNAME).collection("operatori");
  collection.find({ _id: _id }).toArray((err: Error, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      res.send(data);
    }
    req["connessione"].close();
  });
});

app.post(
  "/api/aggiornaPerizia",
  (req: any, res: Response, next: NextFunction) => {
    let descrizione = req.body.descrizione;
    let foto = req.body.foto;
    let _id = new ObjectId(req.body.id);

    let collection = req["connessione"].db(DBNAME).collection("perizie");

    collection.updateOne(
      { _id: _id },
      { $set: { descrizione: descrizione, foto: JSON.parse(foto) } },
      (err: Error, data: any) => {
        if (err) {
          res.status(500);
          res.send("Errore esecuzione query");
        } else {
          res.send({ ris: "ok" });
        }
        req["connessione"].close();
      }
    );
  }
);

app.get("/api/operatori", (req: any, res: Response, next: NextFunction) => {
  let collection = req["connessione"].db(DBNAME).collection("operatori");
  collection.find({}).toArray((err: Error, data: any) => {
    if (err) {
      res.status(500);
      res.send("Errore esecuzione query");
    } else {
      res.send(data);
    }
    req["connessione"].close();
  });
});

app.post("/api/employ", (req: any, res: Response, next: NextFunction) => {
  let nome = req.body.name;
  let mail = req.body.mail;
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash('password', salt, function (err, hash) {
      let record = {
        password: hash,
        nome: nome,
        mail: mail,
        nPerizie: "0",
        '"img"':
          "https://res.cloudinary.com/dfrqbcbln/image/upload/v1672932919/assicurazioni/img_avatar_e9p0bx.png"
      };

      let collection = req["connessione"].db(DBNAME).collection("operatori");
      collection.insertOne(record, (err: Error, data: any) => {
        if (err) {
          res.status(500);
          res.send("Errore esecuzione query");
        } else {
          res.send({ris:'ok'});
        }
        req["connessione"].close();
      });
    });
  })
  
  
});
/* ********************** (Sezione 4) DEFAULT ROUTE  ************************* */
// Default route
app.use("/", function (req: any, res: any, next: NextFunction) {
  res.status(404);
  if (req.originalUrl.startsWith("/api/")) {
    res.send("Risorsa non trovata");
    req["connessione"].close();
  } else res.send(paginaErrore);
});

// Gestione degli errori
app.use("/", (err: any, req: any, res: any, next: any) => {
  if (req["connessione"]) req["connessione"].close();
  res.status(500);
  res.send("ERRR: " + err.message);
  console.log("SERVER ERROR " + err.stack);
});
