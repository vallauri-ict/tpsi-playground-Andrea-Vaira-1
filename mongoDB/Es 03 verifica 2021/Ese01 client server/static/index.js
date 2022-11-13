// page onload jquery

$(document).ready(function () {
  $("#btnFind").click(function () {
    let hairColor = $("#lstHair").val().toLowerCase();
    if ($("#genderWrapper").find("input:checked").length == 0) {
      alert("Please select gender");
    } else {
      let gender = "";
      if ($("#genderWrapper").find("input:checked").length == 1) {
        gender = $("#genderWrapper")
          .find("input:checked")
          .val()
          .toLowerCase()
          .substring(0, 1);
      }
      let request = inviaRichiesta("GET", "/api/unicorns", {
        hair: hairColor,
        gender: gender,
      });
      request.fail(errore);
      request.done(function (data) {
        console.log(data);
        createTable(data);
      });
    }
  });

  $("#btnAggiungiPippo").on("click", function () {
    let date = Date.now();
    let compleanno = new Date(date).toLocaleDateString();
    let request = inviaRichiesta("POST", "/api/AggiungiPippo", {
      name: "Pippo",
      // date format: yyyy-mm-dd
      dob: compleanno,
      gender: "m",
      loves: ["sugar"],
      weight: 80,
    });
    request.fail(errore);
    request.done(function () {
      alert("Pippo added");
    });
  });

  function createTable(data) {
    let table = $("body").find("table");
    table.empty();
    let thead = $("<thead>").appendTo(table);
    for (const key in data[0]) {
      $("<th>").appendTo(thead).text(key);
    }
    let tbody = $("<tbody>").appendTo(table);
    for (const item of data) {
      let tr = $("<tr>").appendTo(tbody);
      for (const key in item) {
        $("<td>").appendTo(tr).text(item[key]);
      }
    }
  }
});
