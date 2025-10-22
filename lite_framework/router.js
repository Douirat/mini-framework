/*
            What is routing?
--> Routing is the mechanism of mapping a URL to some code or component
    tha renders the page.
    <> Traditionally: 
     > Every URL triggers a request to the server.
     > Server responds with a new HTML page.
    <> In sigle page applications:
     > There is only one HTML page.
     > Javascript handles "routing" by showing/hiding component based on the url:
     > The browser URL changes without reloading the page.
*/



class Router {
  constructor(routes = {}, root) {
    this.routes = routes;
    this.root = root;
    this.init();
  }

  init() {
    // Force stay on root
    if (window.location.pathname !== '/') {
      history.replaceState({}, '', '/');
    }

    window.addEventListener('popstate', () => {
      history.replaceState({}, '', '/');
      this.render(this.routes['/']);
    });

    this.render(this.routes['/']);
  }

  render(component) {
    this.root.innerHTML = ''; // Clear old content
    this.root.appendChild(render(component));
  }
}

/*
const routes = {
  '/': {
    tag: 'div',
    attrs: { class: 'app' },
    children: [
      { tag: 'h1', attrs: {}, children: ['Welcome Bennacer'] },
      { tag: 'p', attrs: {}, children: ['Rendering engine locked to root!'] }
    ]
  }
};

const appRoot = document.getElementById('app');
new Router(routes, appRoot);


*/