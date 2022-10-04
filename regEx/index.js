$(document).ready(function () {
  let _text = $(".text");
  let _search = $(".search").find("input").eq(0);
  let _results = $(".results").find("span");

  $(".search")
    .find("input[type=button]")
    .on("click", function () {
      // metodo test() di RegExp
      let reg = new RegExp(_search.val(), "gi");
      let ris = reg.test(_text.text());
      _results.eq(0).text(ris);

      // selezione delle occorrenze
      let reg1 = new RegExp("<mark>|</mark>", "gi");
      let str = _text.html().replace(reg1, function (match) {
        return "";
      });
      let txt = str.replace(reg, function (match) {
        return "<mark>" + match + "</mark>";
      });
      _text.html(txt);

      // metodo exec() di RegExp
      let str1 = "";
      let cont = 1;
      /*while (reg.exec(_text.text()) != null) {
        str1 += `Occorrenza ${cont++} in posizione ${reg.lastIndex} <br>`;
      }*/
      let vet = [];
      while ((vet = reg.exec(_text.text())) != null) {
        str1 += `Occorrenza ${cont++} in posizione ${vet.index} <br>`;
      }
      _results.eq(1).html(str1);

      let occorrenze = [...str.matchAll(new RegExp(reg, "gi"))].map(
        (a) => a.index - _search.val().length
      );
    });
});
