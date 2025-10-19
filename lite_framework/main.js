// import { virtualize } from "./abstraction.js"
import { render } from "./renderer.js"
import { Diff } from "./diffing.js"
import { patch } from "./patch.js"

let oldVDOM = {
    tag: "div",
    props: { id: "app" },
    children: [
        { tag: "h1", children: ["Hello World"] },
        { tag: "button", children: ["Count: 0"] }
    ]
}

let newVDOM = {
    tag: "div",
    props: { id: "app" },
    children: [
        { tag: "h1", children: ["Hello World"] },
        { tag: "button", children: ["Count: 1"] }
    ]
}

render(oldVDOM)

let patches = Diff(oldVDOM, newVDOM)

patch(oldVDOM, newVDOM, patches)
