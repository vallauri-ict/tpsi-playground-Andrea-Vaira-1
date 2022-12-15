$(document).ready(function () {
  $("#btnInvia").on("click", function () {
    getData("https://robertomana-crudserver.onrender.com/api/unicorns");
  });

  $("#btnPeople").on("click", () => {
    getData("/api/people");
  });

  function getData(url) {
    let request = inviaRichiesta("GET", url);
    request.fail(errore);
    request.done(function (data) {
      let tbody = $("table").children("tbody");
      tbody.empty();
      if (!Array.isArray(data)) {
        data = data.results;
      }
      for (let item of data) {
        console.log(item);
        let tr = $("<tr>").appendTo(tbody);
        $("<td>").appendTo(tr).text(JSON.stringify(item));
      }
    });
  }
});
