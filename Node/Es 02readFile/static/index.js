$(document).ready(function () {
  $("#btnInvia1").on("click", function () {
    let request = inviaRichiesta("get", "/api/servizio1", { nome: "pippo" });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
    });
  });

  $("#btnInvia2").on("click", function () {
    let request = inviaRichiesta("get", "/api/servizio2", { nome: "pippo" });
    request.fail(errore);
    request.done(function (data) {
      alert(JSON.stringify(data));
    });
  });
});
