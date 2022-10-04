"use strict"

import _headers from "./headers.json";
import _User, {sayHi, PI, months} from "./modulo"

console.log(_headers.html)
console.log(PI)
console.log(months[2])
console.log(sayHi("pippo"))

let user = new _User("Mr", "Wolf")
console.log(user.concat())

console.log(user.PI)
console.log(user.months[2])
