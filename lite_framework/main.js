import { virtualize } from "./abstraction.js"
import { render } from "./renderer.js"
let dom = virtualize(
    "div",
    { class: "container" },
        {
            tag: "div",
            attrs: { class: "card" },
            children: ["Hello world"]
        },
        {
            tag: "button",
            attrs: {
                onclick: () => { console.log("The user has clicked on me!!!!!"); },
                id: "btn"
            },
            children: ["Click"]
        }
    
);
render(dom)
