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

export class Router {
  constructor(routes = {}) {
    this.routes = routes
    window.addEventListener("popstate", () => {

    })
  }

  init() {

  }



  navigate(path) {
        let component = this.routes[path] || NotFound
  }
}