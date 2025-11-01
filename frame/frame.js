class frame {
    #key = 1
    #initialVDOM = null
    #successiveVDOM = null
    #parent = document.getElementById("root")
    constructor() {
    }

    // create a virtual DOM node
    createVDOM(tag, attrs = {}, children = []) {
        const vnode = { tag, attrs, children, key: "ind-" + this.#key++ };

        if (!this.#initialVDOM) {
            this.#initialVDOM = vnode;
        }
        return vnode;
    }

// append a child virtual DOM node to a parent virtual DOM node
    appendChild(parent, child) {
        parent.children.push(child)
    }

    // set an attribute on a virtual DOM node
    setAttribute(node, attr, value) {
        node.attrs[attr] = value;
    }

// remove a child virtual DOM node from a parent virtual DOM node
    removeChild(parent, childId) {
        parent.children = parent.children.filter(child => child.key !== childId)
    }


}