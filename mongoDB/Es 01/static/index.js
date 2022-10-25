"use strict";

let headers = ["name", "gender", "hair", "weight", "loves"];

$(document).ready(function () {
  let _wrapper = $("#wrapper");
  let _table = $("table");
  let _tbody;

  createHeaders();
  getUnicorns("m");

  function createHeaders() {
    let thead = $("<thead>").appendTo(_table);
    let tr = $("<tr>").appendTo(thead);
    for (let header of headers) {
      $("<th>").appendTo(tr).text(header);
    }
    _tbody = $("<tbody>").appendTo(_table);
  }

  function getUnicorns(gender) {
    let request = inviaRichiesta("GET", "/api/unicorns", { gender });
    request.fail(errore);
    request.done((unicorns) => {
      console.log(unicorns);
      _tbody.empty();
      for (const uni of unicorns) {
        let tr = $("<tr>").appendTo(_tbody);
        $("<td>").appendTo(tr).text(uni["name"]);
        $("<td>").appendTo(tr).text(uni["gender"]);
        $("<td>").appendTo(tr).text(uni["hair"]);
        $("<td>").appendTo(tr).text(uni["weight"]);
        $("<td>").appendTo(tr).text(uni["loves"]);
      }
    });
  }

  _wrapper
    .children("input")
    .eq(0)
    .on("click", () => {
      getUnicorns("m");
    });

  _wrapper
    .children("input")
    .eq(1)
    .on("click", () => {
      getUnicorns("f");
    });
});
