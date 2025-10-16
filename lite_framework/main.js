import { virtualize } from "./abstraction.js"
let dom = virtualize("div", {class: "container"}, [{tag: "div", attrs: {class: "card"}, children: "Hello world"}])
console.log("the new created virtual dom is: ", dom);
