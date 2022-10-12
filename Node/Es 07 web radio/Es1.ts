import _headers from "./headers.json";
import states from "./states.json";
import radios from "./radios.json";
import fs from "fs";
// E' UN UTILITY

for (const state of states) {
  let count = 0;
  for (const radio of radios) {
    if ((radio.state = state.name)) {
      count++;
    }
  }
  state["stationcount"] = count.toString();
}
console.log(JSON.stringify(states));
fs.writeFile("./states.json", JSON.stringify(states), (err) => {
  if (!err) console.log("Scrittura avvenuta correttamente");
});
