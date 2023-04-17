"use strict";
$(document).ready(function () {
  let menuButtons = $(".menu");

  let container1 = $(".home").show();
  let container2 = $(".registrazione").hide();
  let container3 = $(".login").hide();
  let container4 = $(".chat").hide();

  let wrapper = $("#wrapper");
  let txtMessage = $("#txtMessage");

  /* ***************************************************************** */

  menuButtons.on("click", function () {
    nascondi();
    $(`.${this.value}`).show();
  });

  function nascondi() {
    container1.hide();
    container2.hide();
    container3.hide();
    container4.hide();
  }

  $("#btnRegistrazione").on("click", function () {
    nascondi();
    container2.show();
  });

  $("#btnInviaRegistrazione").on("click", function () {
    let formData = new FormData();
    formData.append("username", $("#txtNewUser").val());
    formData.append("image", $("#txtFile").prop("files")[0]);

    let request = inviaRichiesta("POST", "/api/registrazione", formData);
    request.then(function (data) {
      console.log(data);
      alert("Utente creato correttamente");
      nascondi();
      container1.show();
    });
    request.catch(errore);
  });

  $("#btnAccessoLogin").on("click", function () {
    nascondi();
    container3.show();
  });

  $("#btnLogin").on("click", function () {
    let username = $("#txtUser").val();
    let serverSocket;
    let request = inviaRichiesta("POST", "/api/login", { username });
    request.then(function (data) {
      console.log(data);

      let user = data.data;
      user.room = $("#lstRooms").val();

      let options = { transports: ["websocket"], upgrade: false };
      // Invia una richiesta di connessione al server dal quale è stata scaricata la pagina
      serverSocket = io(options).connect();

      serverSocket.on("connect", () => {
        console.log(user);
        serverSocket.emit("joinRoom", JSON.stringify(user));
      });

      serverSocket.on("joinRoomAck", (data) => {
        document.title = user.username;
        nascondi();
        container4.show();

        $("#chatTitle").text("Vallauri Chat " + user.room);
        console.log(data);
        for (const user of JSON.parse(data)) {
          let div = $("<div>").appendTo($("#banner"));
          let img = $("<img>").appendTo(div);
          img.prop("src", "img/" + user.image);
          let p = $("<p>").appendTo(div).text(user.username);
        }
      });
      serverSocket.on("notifyMessage", (response) => {
        response = JSON.parse(response);
        visualizza(response);
      });

      $("#btnInvia").on("click", () => {
        let msg = $("#txtMessage").val();
        serverSocket.emit("newMessage", msg);
      });

      $("#btnDisconnetti").on("click", () => {
        serverSocket.disconnect();
        nascondi();
        container1.show();
      });
    });
    request.catch(errore);
  });

  function visualizza(data) {
    let container = $("#wrapper");
    container.appendTo(wrapper);

    let date = new Date(data.date);
    let mittente = $(
      "<img src='img/" +
        data.img +
        "'>" +
        "<small class='message-from'>" +
        data.from +
        " @" +
        date.toLocaleTimeString() +
        "</small>"
    );
    mittente.appendTo(container);

    // messaggio
    let message = $("<p class='message-data'>" + data.message + "</p>");
    message.appendTo(container);

    // auto-scroll dei messaggi
    /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
	l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
	*/
    let h = wrapper.prop("scrollHeight");
    // fa scorrere il testo verso l'alto in 500ms
    wrapper.animate({ scrollTop: h }, 500);
    $("#txtMessage").val("");
  }
});

// "use strict";

// $(document).ready(function () {
//   let menuButtons = $(".menu");
//   let selectedUser = $("#selectedUser");
//   let selectedRoom = $("#selectedRoom");

//   let homeContainter = $(".home").show();
//   let utentiContainter = $(".utenti").hide();
//   let stanzeContainter = $(".stanze").hide();
//   let chatContainter = $(".chat").hide();

//   let divUtenti = $("#divUtenti");
//   let divStanze = $("#divStanze");

//   let wrapper = $("#wrapper");
//   let txtMessage = $("#txtMessage");
//   let btnConnetti = $("#btnConnetti").prop("disabled", true);
//   let btnDisconnetti = $("#btnDisconnetti").prop("disabled", true);
//   let btnInvia = $("#btnInvia").prop("disabled", true);

//   /* **************************** */

//   menuButtons.on("click", function () {
//     homeContainter.hide();
//     utentiContainter.hide();
//     stanzeContainter.hide();
//     chatContainter.hide();
//     $(`.${this.value}`).show();
//   });

//   menuButtons.eq(1).on("click", function () {
//     let request = inviaRichiesta("GET", "/api/utenti");
//     request.then((response) => {
//       let users = response.data;
//       divUtenti.empty();
//       for (const user of users) {
//         $("<label>")
//           .addClass("form-check-label")
//           .appendTo(divUtenti)
//           .append(
//             $("<input>")
//               .prop({
//                 type: "radio",
//                 name: "radioUser",
//               })
//               .addClass("form-check-input")
//               .on("click", function () {
//                 selectedUser.text(user.username);
//                 selectedUser.prop("user", user);
//               })
//           )
//           .append($("<span>").text(user.username));
//         let image = "img/" + user.img;
//         if (user.img == "") image = "img/default.jpg";
//         $("<img>").prop("src", image).appendTo(divUtenti);
//         $("<br>").appendTo(divUtenti);
//       }
//     });
//     request.catch(errore);
//   });

//   divStanze.find("input").on("click", function () {
//     selectedRoom.text($(this).next().text());
//   });

//   menuButtons.eq(3).on("click", function () {
//     if (selectedUser.text != "" && selectedRoom.text != "") {
//       btnConnetti.prop("disabled", false);
//     }
//   });

//   $("#btnAdd").on("click", () => {
//     let formData = new FormData();
//     formData.append("username", $("#newUser").val());
//     formData.append("image", $("#txtFile").prop("files")[0]);

//     let request = inviaRichiesta("PUT", "/api/addUser", formData);
//     request.then(() => {
//       alert("Utente inserito correttamente");
//     });
//     request.catch(errore);
//   });

//   // ******************* SOCKET *************************
//   let serverSocket;
//   $("#btnConnetti").on("click", function () {
//     let user = selectedUser.prop("user");
//     user.room = selectedRoom.text();

//     let options = { transports: ["websocket"], upgrade: false };
//     // Invia una richiesta di connessione al server dal quale è stata scaricata la pagina
//     serverSocket = io(options).connect();

//     serverSocket.on("connect", () => {
//       console.log(user);
//       serverSocket.emit("joinRoom", JSON.stringify(user));
//     });

//     serverSocket.on("joinRoomAck", (data) => {
//       if (data == "ok") {
//         document.title = user.username;
//         btnConnetti.prop("disabled", true);
//         btnInvia.prop("disabled", false);
//         btnDisconnetti.prop("disabled", false);
//         wrapper.empty();
//       }
//     });

//     serverSocket.on("notifyMessage", (response) => {
//       response = JSON.parse(response);
//       visualizza(response);
//     });
//   });

//   btnInvia.on("click", () => {
//     let msg = $("#txtMessage").val();
//     serverSocket.emit("newMessage", msg);
//   });

//   btnDisconnetti.on("click", () => {
//     serverSocket.disconnect();
//     btnConnetti.prop("disabled", false);
//     btnDisconnetti.prop("disabled", true);
//     btnInvia.prop("disabled", true);
//   });

//   function visualizza(data) {
//     let container = $("<div class='message-container'></div>");
//     container.appendTo(wrapper);

//     // username e date
//     let date = new Date(data.date);
//     let mittente = $(
//       "<img src='img/" +
//         data.img +
//         "'>" +
//         "<small class='message-from'>" +
//         data.from +
//         " @" +
//         date.toLocaleTimeString() +
//         "</small>"
//     );
//     mittente.appendTo(container);

//     // messaggio
//     let message = $("<p class='message-data'>" + data.message + "</p>");
//     message.appendTo(container);

//     // auto-scroll dei messaggi
//     /* la proprietà html scrollHeight rappresenta l'altezza di wrapper oppure
// 	l'altezza del testo interno qualora questo ecceda l'altezza di wrapper
// 	*/
//     let h = wrapper.prop("scrollHeight");
//     // fa scorrere il testo verso l'alto in 500ms
//     wrapper.animate({ scrollTop: h }, 500);
//     $("#txtMessage").val("");
//   }
// });
