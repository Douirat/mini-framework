import { Diff } from './diffing.js'
import { patch } from './patch.js';

export class StateManager {
    #next = 0;
    #oldVDOM = null;
    #currentVDOM = null;
    constructor() {

    }

    virtualize = (tag, attrs = {}, children = []) => {
        this.#next += 1
        return { tag, attrs, children, key: this.#next }
    }

    // 2. Action handlers — directly modify VDOM.
    actions = {
        addChild: (vNode, child) => {
            vNode.children.push(child);
        },
        removeChild: (vNode, key) => {
            vNode.children = vNode.children.filter(c => c.key !== key);
        },
        updateAttr: (vNode, attr, value) => {
            vNode.attrs[attr] = value;
        },
        replaceNode: (vNode, key, newNode) => {
            vNode.children = vNode.children.map(c => c.key === key ? newNode : c);
        }
    };

    // Modify the virtual DOM.
    modifyVirtualDOM(node, key, fn) {
        if (node.key === key) fn(node)
        else node.children.forEach(child => this.modifyVirtualDOM(child, key, fn))

        // After modification, diff & patch
        const patches = Diff(this.#oldVDOM, this.#currentVDOM);
        patch(patches, document.getElementById("root"));
        this.#oldVDOM = structuredClone(this.#currentVDOM);
    }

    init(rootNode) {
        this.#currentVDOM = rootNode;
        this.#oldVDOM = structuredClone(rootNode);
        const rootEl = render(rootNode);
        document.getElementById("root").appendChild(rootEl);
    }
}