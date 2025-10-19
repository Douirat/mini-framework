/*
                --- What is patching? ---
Patching is the imperative step that turns the plan produced by reconciliation/diffing a list of patches 
into actual DOM mutations.
Reconciliation answers what changed; patching performs updates the browser;
*/
import { render } from "./renderer";

export const patch = (oldVDOM, newVDOM, patches) => {
    console.log(patches);
    
patches.forEach((patch, i) => {
    
});
}