import { virtualize } from './lite_framework/abstraction.js';

let dom = virtualize("div", {class: "container"}, virtualize("div", {class: "card"}, virtualize("div", {class: "content"},"Hello world")))
console.log("the new created virtual dom is: ", dom);
