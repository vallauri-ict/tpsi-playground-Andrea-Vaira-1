"use strict";
$(document).ready(function () {
  let _login = $("#login");
  let _mail = $("#mail");

  let _username = $("#usr");
  let _password = $("#pwd");
  let _lblErrore = $("#lblErrore");
  let _btnInvia = $("#btnInvia");
  let _btnLogin = $("#btnLogin");

  let userLogged;

  _mail.hide();

  _lblErrore.hide();
  _lblErrore.children("button").on("click", function () {
    _lblErrore.hide();
  });

  _btnLogin.on("click", function () {
    let username = _username.val();
    let pwd = _password.val();

    let request = inviaRichiesta("POST", "/api/login", {
      username: username,
      password: pwd,
    });
    request.fail(function (jqXHR, test_status, str_error) {
      if (jqXHR.status == 401) {
        _lblErrore.show();
        _lblErrore.children("span").text("Username o password errati");
      } else errore(jqXHR, test_status, str_error);
    });
    request.done(function (ris) {
      _login.hide();
      _mail.show();

      userLogged = username;

      let request = inviaRichiesta("GET", "/api/mails", {
        username: username,
        password: pwd,
      });
      request.fail(errore);
      request.done(function (data) {
        console.log(data);

        _login.hide();
        _mail.show();

        userLogged = data[0].username;

        let vetMails = data[0].mail;
        vetMails = vetMails.reverse();

        let tbody = $("#tabMail").children("tbody");
        for (const mail of vetMails) {
          let tr = $("<tr>").appendTo(tbody);
          $("<td>").text(mail.from).appendTo(tr);
          $("<td>").text(mail.subject).appendTo(tr);
          $("<td>").text(mail.body).appendTo(tr);
          let td = $("<td>").appendTo(tr);
          $("<a>")
            .prop({ href: "img/" + mail.attachment, target: "_blank" })
            .text(mail.attachment)
            .appendTo(td);
        }
      });
    });
  });

  _btnInvia.on("click", function () {
    let to = $("#txtTo").val();
    let request = inviaRichiesta("POST", "/api/findUser", { to });
    request.fail((jqXHR, test_status, str_error) => {
      if (jqXHR.status == 401) {
        alert("Utente non trovato");
      } else errore(jqXHR, test_status, str_error);
    });
    request.done(function (ris) {
      console.log(ris);
      let subject = $("#txtSubject").val();
      let message = $("#txtMessage").val();

      if (subject == "" || message == "") {
        alert("Compila tutti i campi");
        return;
      } else {
        let formData = new FormData();
        formData.append("from", userLogged);
        formData.append("to", to);
        formData.append("subject", subject);
        formData.append("message", message);
        if ($("#txtAttachment").prop("files")[0] != null) {
          formData.append("image", $("#txtAttachment").prop("files")[0]);
        }

        let request = inviaRichiestaMultipart(
          "POST",
          "/api/sendMail",
          formData
        );
        request.fail(errore);
        request.done(function (data) {
          console.log(data);
          alert("Mail inviata");
        });
      }
    });
  });
});
