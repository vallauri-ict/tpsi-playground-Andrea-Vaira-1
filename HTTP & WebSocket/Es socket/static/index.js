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
    let options = { transports: ["websocket"], upgrade: false };
    serverSocket = io(options).connect();
    serverSocket.on("connect", () => {
      let user = {
        username: selectedUser.text(),
        room: selectedRoom.text(),
      };
      serverSocket.emit("joinRoom", JSON.stringify(user));
    });
  });
});
