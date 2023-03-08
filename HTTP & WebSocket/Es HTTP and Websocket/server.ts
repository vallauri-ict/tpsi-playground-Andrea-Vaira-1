import http from "http";
import url from "url";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import fileUpload from "express-fileupload";
import cloudinary, { UploadApiResponse }  from "cloudinary";
import colors from 'colors';
import { Server, Socket } from 'socket.io'

// config
const PORT = 1337;
dotenv.config({ path: ".env" });
const app = express();
const connectionString: any = process.env.connectionString;
const DBNAME = "MongoDB_Esercizi";
cloudinary.v2.config(JSON.parse(process.env.cloudinary as string));
//CREAZIONE E AVVIO DEL SERVER HTTP
let httpServer = http.createServer(app);
let paginaErrore: string = "";
const io = new Server(httpServer);

httpServer.listen(PORT, () => {
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
app.get("/api/images", (req: any, res: any, next: any) => {
  let collection = req["connessione"].db(DBNAME).collection("Images");

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
        let collection = req["connessione"].db(DBNAME).collection("Images");
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

/************************* SOCKET SERVER ********************** */
let users:any[] = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  
  Per ogni utente andiamo a creare variabile locale 'user'
  contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function (clientSocket:any) {
	let user = {} as {username:string, socket:Socket, room:string};
  clientSocket.on("login", function(clientUser:any){
    clientUser = JSON.parse(clientUser);
    let aus = users.find(item => item.username == clientUser.username);
    if(!aus){
      user = {
        username : clientUser.username,
        socket : clientSocket,
        room : clientUser.room
      }
      users.push(user);
      console.log(`user = ${colors.yellow(user.username)} - socketId = ${user.socket.id} - isConnetted `)
      clientSocket.join(user.room); //aggiunge utente attuale nella stanza indicata dal client
      clientSocket.emit("loginAck", "Ok")
    }
    else {
      clientSocket.emit("loginAck", "notOk")
    }
  })

  clientSocket.on("New Message", function(data:any){
    console.log(`
      user = ${colors.yellow(user.username)} 
      - socketId = ${user.socket.id} 
      - message = ${colors.green(data)} `);
    
      let response = {
        "from" : user.username,
        "message" : data,
        "date": new Date()
      }
      // io.sockets.emit("Notify Message", JSON.stringify(response)); //emit in broadcast (compreso il mittente)
      io.to(user.room).emit("Notify Message", JSON.stringify(response)); //emit in una particolare stanza
  })

  clientSocket.on("disconnect", function(){
    delete users[users.indexOf(user)];
    console.log(`user = ${colors.yellow(user.username)} - isDisconnected`)
  });
});

// stampa i log con data e ora
function log(msg:any) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " + msg)
}