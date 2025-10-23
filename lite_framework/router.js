/*
            What is routing?
--> Routing is the mechanism of mapping a URL to some code or component
    that renders the page.
    <> Traditionally: 
     > Every URL triggers a request to the server.
     > Server responds with a new HTML page.
    <> In sigle page applications:
     > There is only one HTML page.
     > Javascript handles "routing" by showing/hiding component based on the url:
     > The browser URL changes without reloading the page.
     --> 
*/

import { notFound } from "./not_found.js"
import { render } from "./renderer.js"
export class Router {
  #root = document.getElementById('root')

  constructor(routes = {}) {
    this.routes = routes
  }

  init() {
    window.addEventListener("hashchange", () => {
      this.navigate(window.location.hash.slice(1));
    });

    // Initial render
    this.navigate(window.location.hash.slice(1) || "/");
  }



  navigate(path) {
    console.log("the page the user wants to display is: ", path);
    
      let component = this.routes[path] || notFound
      this.#root.innerHTML = ""
      this.#root.appendChild(render(component))
    
  }
}