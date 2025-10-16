export const virtualize = (tag, attrs, ...children) => {
    return {
        tag, // maps to an html tag.
        attrs, // maps to an html attribute(id, class, onclick, data-*, style ...)
        children // nested elments or text nods
    }
}

// the purpose of this function is to virtualize the representation of an HTML element, instead of creating 
// the actual DOM node immediately,



/*
==> input:
let dom = virtualize("div", {class: "container"}, [{tag: "div", attrs: {class: "card"}, children: "Hello world"}])
console.log("the new created virtual dom is: ", dom);
==> output:
{
    "tag": "div",
    "attrs": {
        "class": "container"
    },
    "children": [
        [
            {
                "tag": "div",
                "attrs": {
                    "class": "card"
                },
                "children": "Hello world"
            }
        ]
    ]
}


Explanation:
--> Instead of directely writing HTML or manipulating document.createElement
    you work with plain js objects, later a renderer will take these objects 
    and turn them into real Dom element.
--> This will help later to Update the real DOM selectively
    Only insert/update/remove the elements that actually changed.
    Minimizes browser reflows and repaints
*/