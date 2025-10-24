# Lite Framework - Complete Usage Guide

## Overview

Lite Framework is a minimal, educational frontend framework that implements core concepts found in modern frameworks like React and Vue. It uses a Virtual DOM approach with efficient diffing and patching to update the UI.

## Core Concepts

### 1. Virtual DOM
Instead of manipulating the real DOM directly, you create JavaScript objects that describe your UI structure. The framework then converts these objects into actual DOM elements.

### 2. Diffing
When the UI needs to update, the framework compares the old virtual DOM with the new one to determine exactly what changed.

### 3. Patching
Only the parts that changed are updated in the real DOM, making updates efficient and performant.

### 4. Routing
The framework includes a simple hash-based router for single-page applications.

---

## Getting Started

### Basic HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

---

## Creating Virtual DOM Elements

### Using the `virtualize` Function

The `virtualize` function creates virtual DOM nodes:

```javascript
import { virtualize } from './lite_framework/abstraction.js';

// Simple element
const heading = virtualize("h1", { class: "title" }, ["Hello World"]);

// Nested elements
const card = virtualize("div", { class: "card" }, [
    virtualize("h2", {}, ["Card Title"]),
    virtualize("p", {}, ["Card content goes here"]),
    virtualize("button", { id: "btn" }, ["Click Me"])
]);
```

### Virtual DOM Structure

```javascript
{
    tag: "div",           // HTML tag name
    attrs: {              // HTML attributes
        class: "container",
        id: "main",
        style: "color: red"
    },
    children: [           // Array of children (strings or virtual nodes)
        "Text content",
        { tag: "span", attrs: {}, children: ["More text"] }
    ]
}
```

---

## Event Handling

Add event listeners by prefixing attribute names with "on":

```javascript
const button = virtualize("button", {
    class: "btn-primary",
    onclick: (e) => {
        console.log("Button clicked!", e);
        // Your event handler logic
    }
}, ["Click Me"]);
```

Supported events: `onclick`, `onchange`, `oninput`, `onsubmit`, `onmouseover`, etc.

---

## Building a Simple Application

### Step 1: Create Your Components

```javascript
import { virtualize } from './lite_framework/abstraction.js';

// Home page component
const homePage = virtualize("div", { class: "page" }, [
    virtualize("h1", {}, ["Welcome Home"]),
    virtualize("p", {}, ["This is the home page"]),
    virtualize("a", { href: "#/about" }, ["Go to About"])
]);

// About page component
const aboutPage = virtualize("div", { class: "page" }, [
    virtualize("h1", {}, ["About Us"]),
    virtualize("p", {}, ["Learn more about our app"]),
    virtualize("a", { href: "#/" }, ["Back to Home"])
]);
```

### Step 2: Set Up the Router

```javascript
import { App } from './lite_framework/router.js';

const router = {
    "/": homePage,
    "/about": aboutPage
};

const app = new App(router);
app.init();
```

---

## Dynamic Updates with State

To create interactive, stateful components, you need to manually trigger re-renders:

```javascript
import { virtualize } from './lite_framework/abstraction.js';
import { App } from './lite_framework/router.js';

// State
let count = 0;

// Function to create the counter component
function createCounter() {
    return virtualize("div", { class: "counter" }, [
        virtualize("h1", {}, [`Count: ${count}`]),
        virtualize("button", {
            onclick: () => {
                count++;
                // Trigger re-render
                update(createCounter());
            }
        }, ["Increment"]),
        virtualize("button", {
            onclick: () => {
                count--;
                // Trigger re-render
                update(createCounter());
            }
        }, ["Decrement"])
    ]);
}

// Set up app
const router = {
    "/": createCounter()
};

const app = new App(router);
const update = app.init();
```

---

## Advanced Example: Todo List

```javascript
import { virtualize } from './lite_framework/abstraction.js';
import { App } from './lite_framework/router.js';

// State
let todos = [];
let inputValue = "";

// Create todo item
function createTodoItem(todo, index) {
    return virtualize("li", { class: "todo-item" }, [
        virtualize("span", {}, [todo.text]),
        virtualize("button", {
            onclick: () => {
                todos.splice(index, 1);
                update(createTodoApp());
            }
        }, ["Delete"])
    ]);
}

// Create the main app
function createTodoApp() {
    return virtualize("div", { class: "todo-app" }, [
        virtualize("h1", {}, ["My Todo List"]),
        virtualize("div", { class: "input-group" }, [
            virtualize("input", {
                type: "text",
                value: inputValue,
                placeholder: "Enter a todo...",
                oninput: (e) => {
                    inputValue = e.target.value;
                }
            }, []),
            virtualize("button", {
                onclick: () => {
                    if (inputValue.trim()) {
                        todos.push({ text: inputValue, id: Date.now() });
                        inputValue = "";
                        update(createTodoApp());
                    }
                }
            }, ["Add"])
        ]),
        virtualize("ul", { class: "todo-list" }, 
            todos.map((todo, index) => createTodoItem(todo, index))
        )
    ]);
}

// Initialize
const router = {
    "/": createTodoApp()
};

const app = new App(router);
const update = app.init();
```

---

## Routing in Detail

### Hash-Based Navigation

The framework uses hash-based routing (`#/path`):

```javascript
const router = {
    "/": homePage,
    "/about": aboutPage,
    "/contact": contactPage
};
```

### Creating Navigation Links

```javascript
virtualize("nav", {}, [
    virtualize("a", { href: "#/" }, ["Home"]),
    virtualize("a", { href: "#/about" }, ["About"]),
    virtualize("a", { href: "#/contact" }, ["Contact"])
]);
```

### 404 Not Found

The framework automatically shows a 404 page for undefined routes if you have a `notFound` component.

---

## Best Practices

### 1. Component Functions
Always use functions to create components that depend on state:

```javascript
// ✅ Good - Function returns fresh virtual DOM
function createComponent() {
    return virtualize("div", {}, [`Count: ${count}`]);
}

// ❌ Bad - Static virtual DOM won't update
const component = virtualize("div", {}, [`Count: ${count}`]);
```

### 2. State Management
Keep state variables outside component functions and trigger updates explicitly:

```javascript
let state = { user: "John", age: 25 };

function updateState(newState) {
    state = { ...state, ...newState };
    update(createApp());
}
```

### 3. Event Handlers
Use arrow functions to maintain scope:

```javascript
virtualize("button", {
    onclick: () => {
        // Can access outer scope
        count++;
        update(createCounter());
    }
}, ["Click"]);
```

### 4. Children Arrays
Always use arrays for children, even for single children:

```javascript
// ✅ Correct
virtualize("div", {}, ["Single child"]);

// ✅ Also correct
virtualize("div", {}, [
    virtualize("span", {}, ["Child 1"]),
    virtualize("span", {}, ["Child 2"])
]);
```

---

## How It Works Under the Hood

### 1. Initial Render
- Virtual DOM created → `render()` converts to real DOM → Inserted into `#root`

### 2. Update Cycle
- State changes → New virtual DOM created → `Diff()` compares old vs new → `patch()` updates only changed parts

### 3. Diffing Algorithm
The framework compares:
- **Tags**: Different tags trigger replacement
- **Attributes**: Changed attributes are updated
- **Children**: Recursively compares each child
- **Text**: Changed text content is updated

---

## Limitations & Considerations

1. **No Reactive System**: You must manually trigger updates (no automatic reactivity like Vue)
2. **Simple Diffing**: The diffing algorithm is basic and doesn't use keys for list optimization
3. **Hash Routing Only**: Uses `#` in URLs, not full history API
4. **No Component Lifecycle**: No mount/unmount hooks
5. **Manual Re-renders**: You control when the UI updates

---

## Complete Working Example

```javascript
import { virtualize } from './lite_framework/abstraction.js';
import { App } from './lite_framework/router.js';

// State
let state = {
    currentView: 'counter',
    count: 0,
    name: ''
};

// Counter view
function counterView() {
    return virtualize("div", { class: "view" }, [
        virtualize("h2", {}, ["Counter"]),
        virtualize("p", {}, [`Count: ${state.count}`]),
        virtualize("button", {
            onclick: () => {
                state.count++;
                update(createApp());
            }
        }, ["+"]),
        virtualize("button", {
            onclick: () => {
                state.count--;
                update(createApp());
            }
        }, ["-"]),
        virtualize("a", { href: "#/form" }, ["Go to Form"])
    ]);
}

// Form view
function formView() {
    return virtualize("div", { class: "view" }, [
        virtualize("h2", {}, ["Form"]),
        virtualize("input", {
            type: "text",
            placeholder: "Enter name",
            oninput: (e) => {
                state.name = e.target.value;
            }
        }, []),
        virtualize("p", {}, [`Hello, ${state.name || 'stranger'}!`]),
        virtualize("a", { href: "#/" }, ["Back to Counter"])
    ]);
}

// Main app
function createApp() {
    return virtualize("div", { class: "app" }, [
        virtualize("h1", {}, ["Lite Framework Demo"]),
        state.currentView === 'counter' ? counterView() : formView()
    ]);
}

// Router setup
const router = {
    "/": counterView(),
    "/form": formView()
};

const app = new App(router);
const update = app.init();
```

---

## Summary

Lite Framework provides a minimal but functional implementation of modern frontend concepts. While it lacks the sophistication of production frameworks, it's excellent for learning how Virtual DOM, diffing, and patching work under the hood. Use it to understand the fundamentals before diving into React, Vue, or other full-featured frameworks.