import { virtualize } from "../../lite_framework/abstraction.js"

class TODO {
  #all = []
  #active = []
  #completed = []
  #router = {
  }

  // constructor:
  constructor(container, app) {
    this.container = this.container
    this.app = app
    if(this.app) this.app.init()
  }

  render_all() {

  }

  render_active(){

  }

  render_complede(){

  }

  add_to_all() {

  }

  add_to_active() {

  }

  add_to_completed() {

  }
}


/*
const todoVDOM = virtualize(
  "section",
  { class: "todoapp", id: "root" },
  [
    // Header
    virtualize("header", { class: "header", "data-testid": "header" }, [
      virtualize("h1", {}, ["todos"]),
      virtualize("div", { class: "input-container" }, [
        virtualize("input", {
          class: "new-todo",
          id: "todo-input",
          type: "text",
          "data-testid": "text-input",
          placeholder: "What needs to be done?",
          value: ""
        }),
        virtualize("label", { class: "visually-hidden", for: "todo-input" }, [
          "New Todo Input"
        ])
      ])
    ]),

    // Main
    virtualize("main", { class: "main", "data-testid": "main" }, [
      virtualize("div", { class: "toggle-all-container" }, [
        virtualize("input", {
          class: "toggle-all",
          type: "checkbox",
          id: "toggle-all",
          "data-testid": "toggle-all"
        }),
        virtualize("label", { class: "toggle-all-label", for: "toggle-all" }, [
          "Toggle All Input"
        ])
      ]),
      virtualize("ul", { class: "todo-list", "data-testid": "todo-list" }, [
        virtualize("li", { class: "", "data-testid": "todo-item" }, [
          virtualize("div", { class: "view" }, [
            virtualize("input", { class: "toggle", type: "checkbox", "data-testid": "todo-item-toggle" }),
            virtualize("label", { "data-testid": "todo-item-label" }, ["ggg"]),
            virtualize("button", { class: "destroy", "data-testid": "todo-item-button" })
          ])
        ]),
        virtualize("li", { class: "", "data-testid": "todo-item" }, [
          virtualize("div", { class: "view" }, [
            virtualize("input", { class: "toggle", type: "checkbox", "data-testid": "todo-item-toggle" }),
            virtualize("label", { "data-testid": "todo-item-label" }, ["ddd"]),
            virtualize("button", { class: "destroy", "data-testid": "todo-item-button" })
          ])
        ]),
        virtualize("li", { class: "", "data-testid": "todo-item" }, [
          virtualize("div", { class: "view" }, [
            virtualize("input", { class: "toggle", type: "checkbox", "data-testid": "todo-item-toggle" }),
            virtualize("label", { "data-testid": "todo-item-label" }, ["ddd"]),
            virtualize("button", { class: "destroy", "data-testid": "todo-item-button" })
          ])
        ])
      ])
    ]),

    // Footer
    virtualize("footer", { class: "footer", "data-testid": "footer" }, [
      virtualize("span", { class: "todo-count" }, ["3 items left!"]),
      virtualize("ul", { class: "filters", "data-testid": "footer-navigation" }, [
        virtualize("li", {}, [
          virtualize("a", { class: "selected", href: "#/" }, ["All"])
        ]),
        virtualize("li", {}, [
          virtualize("a", { class: "", href: "#/active" }, ["Active"])
        ]),
        virtualize("li", {}, [
          virtualize("a", { class: "", href: "#/completed" }, ["Completed"])
        ])
      ]),
      virtualize("button", { class: "clear-completed", disabled: true }, ["Clear completed"])
    ])
  ]
);
*/