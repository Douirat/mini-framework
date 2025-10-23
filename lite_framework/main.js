// import { virtualize } from "./abstraction.js"
import { render } from "./renderer.js"
import { Diff } from "./diffing.js"
import { patch } from "./patch.js"
import { virtualize } from "./abstraction.js";
import {Router} from "./router.js"

// const oldVDOM = virtualize(
//   "div",
//   { id: "root", class: "container" }, // attributes
//   [
//     virtualize("h1", {}, ["Welcome"]),
//     virtualize("p", {}, ["This is the old paragraph."]),
//     virtualize("ul", {}, [
//       virtualize("li", {}, ["Apple"]),
//       virtualize("li", {}, ["Banana"]),
//       virtualize("li", {}, ["Cherry"])
//     ]),
//     virtualize("section", {}, [
//       virtualize("h2", {}, ["About Us"]),
//       virtualize("div", {}, [
//         virtualize("p", {}, ["Old description text."]),
//         virtualize("button", {}, ["Click Me"])
//       ])
//     ])
//   ]
// );

// console.log("the old virtual DOM: ", oldVDOM);



// const newVDOM = virtualize("div",
//   { id: "root", class: "container" }, // attributes
//   [
//     virtualize("h1", {}, ["Welcome to the New App!"]), // text changed
//     virtualize("p", {}, ["This paragraph has been updated."]), // text changed
//     virtualize("ul", {}, [
//       virtualize("li", {}, ["Apple 🍎"]), // text changed
//       // Banana removed
//       virtualize("li", {}, ["Cherry 🍒"]),
//       virtualize("li", {}, ["Dragonfruit 🐉"]) // new child added
//     ]),
//     virtualize("section", {}, [
//       virtualize("h2", {}, ["About the Company"]), // text changed
//       virtualize("div", {}, [
//         virtualize("p", {}, ["This is the *new* description."]),
//         // button replaced with an <a> tag
//         virtualize("a", { href: "#" }, ["Learn More"]),
//         // new child added
//         virtualize("small", {}, ["Last updated: today"])
//       ])
//     ]),
//     // Entirely new node added
//     virtualize("footer", {}, [
//       virtualize("p", {}, ["Footer text goes here."])
//     ])
//   ]
// );


// console.log("The new virtual DOM", newVDOM);


// document.body.appendChild(render(oldVDOM))

// let patches = Diff(oldVDOM, newVDOM)

// console.log("patches: ===> ", patches);

// patch(patches)

const routes = {
};

let router = new Router(routes)
router.init()