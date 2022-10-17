"use strict";

$(document).ready(function () {
  let requestategories = inviaRichiesta("GET", "/api/categories");
  requestategories.fail(errore);
  requestategories.done((categotries) => {
    console.log(categotries["categories"]);
    let listBox = $("#listBox");
    for (const cat of categotries["categories"]) {
      //<option value="option1">Option 1</option>;
      $("<option>").appendTo(listBox).val(cat).text(cat);
    }
    getFacts("career");
  });

  $("#listBox").on("change", function () {
    console.log($(this).val());
    getFacts($(this).val());
  });

  $("#btnInvia").on("click", function () {
    let ids = [];
    let len = $("#facts").find("input[type=checkbox]:checked").length;
    for (let i = 0; i < len; i++) {
      let value = $("#facts").find("input[type=checkbox]:checked").eq(i).val();
      ids.push(value);
    }
    console.log(ids);
    let requestRate = inviaRichiesta("POST", "/api/rate", { ids });
    requestRate.fail(errore);
    requestRate.done((ris) => {
      alert(ris.ris);
    });
  });

  $("#btnAdd").on("click", function () {
    let requestAdd = inviaRichiesta("POST", "/api/add", {
      categoria: $("#listBox").val(),
      value: $("#newFact").val(),
    });
    requestAdd.fail(errore);
    requestAdd.done((ris) => {
      alert(ris.ris);
      getFacts($("#listBox").val());
    });
  });

  function getFacts(category) {
    let requestCareer = inviaRichiesta("GET", "/api/facts", { category });
    requestCareer.fail(errore);
    requestCareer.done((facts) => {
      console.log(facts["vetFacts"]);
      let vetFacts = facts["vetFacts"];
      let mainWrapper = $("#facts");
      mainWrapper.empty();
      for (const fact of vetFacts) {
        //<input type="checkbox" value="factID"> <span> factValue </span> <br>
        $("<input>")
          .prop("type", "checkbox")
          .val(fact.id)
          .appendTo(mainWrapper);
        $("<span>").text(fact.value).appendTo(mainWrapper);
        $("<br>").appendTo(mainWrapper);
      }
    });
  }
});
