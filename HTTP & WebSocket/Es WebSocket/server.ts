"use strict";
import http from 'http';
import colors from 'colors';
import express from 'express';
import { Server, Socket } from 'socket.io'

const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = 1337

httpServer.listen(PORT, function () {
	console.log('Server listening on port ' + PORT);
});

app.use(express.static('./static'));


/************************* gestione web socket ********************** */
let users:any[] = [];

/* in corrispondenza della connessione di un client,
  per ogni utente viene generato un evento 'connection' a cui
  viene inettato il 'clientSocket' contenente IP e PORT del client.
  
  Per ogni utente andiamo a creare variabile locale 'user'
  contenente tutte le informazioni relative al singolo utente  */

io.on('connection', function (clientSocket:any) {
	let user = {} as {username:string, socket:Socket, room:string};
  
  // Utente fa il login 
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
    //delete users[users.indexOf(user)];
    users.splice(users.indexOf(user),1);
    console.log(`user = ${colors.yellow(user.username)} - isDisconnected`)
  });
});

// stampa i log con data e ora
/*function log(msg:any) {
	console.log(colors.cyan("[" + new Date().toLocaleTimeString() + "]") + ": " + msg)
}*/