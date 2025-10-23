/*
                                        --- What is patching? ---
Patching is the imperative step that turns the plan produced by reconciliation/diffing a list of patches 
into actual DOM mutations.
Reconciliation answers what changed; patching performs updates the browser
*/

import { render } from "./renderer.js";
export const patch = (patches, parent) => {
    if (!patches) return;
    switch (patches.type) {
        case "replace":
            const newNode = render(patches.node);
            parent.parentNode.replaceChild(newNode, parent);
            break;
        case "remove":
            // console.log("patches to remove: ==>", patches.node);
            document.body.removeChild(parent);
            break
        case "text":
            // console.log("patches to write: ==>", patches.text);
            parent.textContent = patches.text;
            break
        case "attributes":
            parent.parentNode.replaceChild(render(patches.node), parent)
            break;
        case "update":
            // Update attributes
            if (patches.attrs) {
                for (let attr in patches.attrs) {
                    parent.setAttribute(attr, patches.attrs[attr]);
                }
            }
            // Recursively patch children
            patches.childs.forEach((childPatch, i) => {
                if (parent.childNodes[i]) {
                    patch(childPatch, parent.childNodes[i]);
                } else {
                    parent.appendChild(render(childPatch.node || childPatch));
                }
            });
            break;
    }
}
