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