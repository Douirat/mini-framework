/*
                --- What is patching? ---
Patching is the imperative step that turns the plan produced by reconciliation/diffing a list of patches 
into actual DOM mutations.
Reconciliation answers what changed; patching performs updates the browser;
*/

import { render } from "./renderer.js";

export const patch = (patches, parent = document.querySelector('#root'), index = 0) => {
    if (!patches) return
    console.log("The node list ===>", parent.childNodes[index]);
    patches.forEach(p =>{
        switch (p.type){
            case "replace":
                parent.replaceChild(render(p.newNode), parent.childNodes[index]);
                break
            case "create":
                parent.appendChild(render(render(p.newNode)))
                break
            case "string":
                parent.textContent = p.newText
                break
            case "children":
            for( let i=0; i<p.childPatches.length; i++){
                  patch(p.childPatches[i], parent.childNodes[i], i);
            }
        }
    })
}