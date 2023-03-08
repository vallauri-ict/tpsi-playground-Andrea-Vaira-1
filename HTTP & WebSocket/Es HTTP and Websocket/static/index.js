"use strict"
$(document).ready(function () {

	let serverSocket
	let user = {};

	$("#btnConnetti").prop("disabled", false)
	$("#btnInvia").prop("disabled", true)
	$("#btnDisconnetti").prop("disabled", true)


	$("#btnConnetti").on("click", function () {
		// io.connect é SINCRONO, bloccante, e restituisce il serverSocket
		serverSocket = io({ transports: ['websocket'], upgrade: false }).connect()

		// 1) connessione		
		serverSocket.on('connect', function () {
			console.log("connessione ok");
			impostaUser();
		});

		// 2) gestione della loginAck
		serverSocket.on("loginAck", (data) => {
			if (data == "notOk") {
				alert("Nome già esistente, scegliere un altro nome");
				impostaUser();
			}
			else {
				document.title = user.username;
				$("#btnConnetti").prop("disabled", true)
				$("#btnInvia").prop("disabled", false)
				$("#btnDisconnetti").prop("disabled", false)

				$("#btnInvia").on("click", function () {
					let msg = $("#txtMessage").val();
					serverSocket.emit("New Message", msg);
				});

				serverSocket.on("Notify Message", (data) => {
					let msg = JSON.parse(data);
					visualizza(msg);
				})

				$("#btnDisconnetti").on("click", function () {
					serverSocket.disconnect();
					$("#btnConnetti").prop("disabled", false)
					$("#btnInvia").prop("disabled", true)
					$("#btnDisconnetti").prop("disabled", true)
				})
			}
		})
	});


	function impostaUser() {
		user.username = prompt("Inserisci lo username:");
		if (user.username.toLowerCase() == "pippo"
			|| user.username.toLowerCase() == "pluto")
			user.room = "room1";
		else user.room = "default_room";
		serverSocket.emit("login", JSON.stringify(user));
	}
});




function visualizza(data) {
	let wrapper = $("#wrapper")
	let container = $("<div class='message-container'></div>");
	container.appendTo(wrapper);

	// username e date
	let date = new Date(data.date);
	let mittente = $("<small class='message-from'>" + data.from + " @"
		+ date.toLocaleTimeString() + "</small>");
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
	wrapper.animate({ "scrollTop": h }, 500);
	$("#txtMessage").val("");
}