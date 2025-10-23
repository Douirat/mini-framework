// import { virtualize } from "./abstraction.js"
import { render } from "./renderer.js"
import { Diff } from "./diffing.js"
import { patch } from "./patch.js"
import { virtualize } from "./abstraction.js";
import {App} from "./router.js"

/*
                lite-framework
    ==> Renderer: turn virtual DOM into real DOM.
        Diffing: compares old virtual DOM with the new virtual DOM.
        Patcher: applies only the minimal changes to the real DOM.
        
-------> You can render once: but for susequent updates (state changes, events, etc.):
        <> There needs to be a mechanism to detect changes in state/data
        <> Then re-run the diff and patch between the old VDOM and the new VDOM.
        <> Finally, update the real DOM minimally.

-------> 
*/


export const app = new App()
app.init()