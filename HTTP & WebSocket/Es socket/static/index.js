"use strict";
$(document).ready(function () {
  let menuButtons = $(".menu");
  let selectedUser = $("#selectedUser");
  let selectedRoom = $("#selectedRoom");

  let homeContainter = $(".home").show();
  let utentiContainter = $(".utenti").hide();
  let stanzeContainter = $(".stanze").hide();
  let chatContainter = $(".chat").hide();

  let divUtenti = $("#divUtenti");
  let divStanze = $("#divStanze");

  let wrapper = $("#wrapper");
  let txtMessage = $("#txtMessage");
  let btnConnetti = $("#btnConnetti").prop("disabled", true);
  let btnDisconnetti = $("#btnDisconnetti").prop("disabled", true);
  let btnInvia = $("#btnInvia").prop("disabled", true);

  /* **************************** */

  menuButtons.on("click", function () {
    homeContainter.hide();
    utentiContainter.hide();
    stanzeContainter.hide();
    chatContainter.hide();
    $(`.${this.value}`).show();
  });

  menuButtons.eq(1).on("click", function () {
    let request = inviaRichiesta("GET", "/api/utenti");
    request.then((response) => {
      let users = response.data;
      divUtenti.empty();
      for (const user of users) {
        $("<label>")
          .addClass("form-check-label")
          .appendTo(divUtenti)
          .append(
            $("<input>")
              .prop({
                type: "radio",
                name: "radioUser",
              })
              .addClass("form-check-input")
              .on("click", function () {
                selectedUser.text(user.username);
                selectedUser.prop("user", user);
              })
          )
          .append($("<span>").text(user.username));
        let image = "img/" + user.img;
        if (user.img == "") image = "img/default.jpg";
        $("<img>").prop("src", image).appendTo(divUtenti);
        $("<br>").appendTo(divUtenti);
      }
    });
    request.catch(errore);
  });

  divStanze.find("input").on("click", function () {
    selectedRoom.text($(this).next().text());
  });

  menuButtons.eq(3).on("click", function () {
    if (selectedUser.text != "" && selectedRoom.text != "") {
      btnConnetti.prop("disabled", false);
    }
  });

  // ******************* SOCKET *************************
  let serverSocket;
  $("#btnConnetti").on("click", function () {
    let user = selectedUser.prop("user");
    user.room = selectedRoom.text();

    let options = { transports: ["websocket"], upgrade: false };
    // Invia una richiesta di connessione al server dal quale è stata scaricata la pagina
    serverSocket = io(options).connect();

    serverSocket.on("connect", () => {
      console.log(user);
      serverSocket.emit("joinRoom", JSON.stringify(user));
    });

    serverSocket.on("joinRoomAck", (data) => {
      if (data == "ok") {
        document.title = user.username;
        btnConnetti.prop("disabled", true);
        btnInvia.prop("disabled", false);
        btnDisconnetti.prop("disabled", false);
        wrapper.empty();
      }
    });

    serverSocket.on("notifyMessage", (response) => {
      response = JSON.parse(response);
      visualizza(response);
    });
  });

  btnInvia.on("click", () => {
    let msg = $("#txtMessage").val();
    serverSocket.emit("newMessage", msg);
  });

  btnDisconnetti.on('click', ()=>{
    serverSocket.disconnect();
    btnConnetti.prop('disabled', false);
    btnDisconnetti.prop("disabled", true);
    btnInvia.prop("disabled", true);
  })

  function visualizza(data) {
    let container = $("<div class='message-container'></div>");
    container.appendTo(wrapper);

    // username e date
    let date = new Date(data.date);
    let mittente = $(
      "<img src='img/"+data.img +"'>"+
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
