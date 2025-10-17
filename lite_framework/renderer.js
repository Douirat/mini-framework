/*
    <<The rendering system is the core engine of every frontend 
    framework it's what turns your data components into real 
    visible, HTML on the screen. >>
--> What is the rendering system?
    <1> Converts the virtula {tag, attrs, children} UI description into actual DOM nodes.
    <2> updates the DOM when data changes or state changes.
    <3> Does it so efficiently {only changes what's necessary}.

    ==> Rendering is about creating the UI from data:
        let user = {"div", {class:"user"}, [{"h1", {class:"name"}, ["bennacer"]}, {"h1", {class:"age"}, ["34"]}]}
        ==> you want to display: 
        <div clas="user">
            <h1>Bennacer</h1>
            <p>Age: 24</p>
        </div>

    ==> In vanilla js the developer will have to do all the DOM work himself:
        let el = document.createElement("div");
        But, framework's rendering system automates that for you,
        render(vertualDOMObject, parent)
*/

export const render = (virtual_dom, parent = document.body) => {
    const el = document.createElement(virtual_dom.tag);

    for (let [key, value] of Object.entries(virtual_dom.attrs || {})) {
        if (key.startsWith("on") && typeof value === "function") {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value === true) {
            el.setAttribute(key, "");
        } else if (value !== false && value != null) {
            el.setAttribute(key, value);
        }
    }
    (virtual_dom.children || []).forEach(child => {
        console.log("The child is: ");

        if (child == null) return; // skip null or undefined
        if (typeof child === "string" || typeof child === "number") {
            el.appendChild(document.createTextNode(child));
        } else {
            render(child, el); // pass the correct parent
        }
    });

    parent.appendChild(el);
};

/*This mirrors the idea behind frameworks like React or Vue: separating the “description”
 of the UI from the actual DOM, allowing us to reason about UI in pure JavaScript objects 
 rather than manipulating the DOM directly. */