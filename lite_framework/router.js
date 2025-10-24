import { notFound } from "./not_found.js"
import { render } from "./renderer.js"
import { patch } from "./patch.js"
import { Diff } from "./diffing.js"
import { append_child, delete_child } from "./events.js"

export class App {
  #root = document.getElementById('root')
  #oldVNode = null

  constructor(router = {}) {
    this.router = router
    this.append_child = append_child
    this.delete_child = delete_child
  }

  init() {
    window.addEventListener("hashchange", () => {
      this.dispatch(window.location.hash.slice(1));
    });

    // Initial render
    return this.dispatch(window.location.hash.slice(1) || "/");
  }

  dispatch(path) {
    console.log("the page the user wants to display is: ", path);

    // pick component from router
    const component = this.router[path] || notFound;

    // initial render
    if (!this.#oldVNode) {
      const newVNode = component;
      this.#root.appendChild(render(newVNode));
      this.#oldVNode = newVNode;
    }

    // return a dispatcher function for developer
    return (newComponent = component) => {
      const newVNode = newComponent;

      if (this.#oldVNode) {
        const patches = Diff(this.#oldVNode, newVNode);
        patch(patches, this.#root);
      } else {
        this.#root.appendChild(render(newVNode));
      }

      this.#oldVNode = newVNode;
    };
  }
}
