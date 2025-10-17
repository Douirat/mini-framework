
# Frontend Framework Lifecycle Flow

This document explains the full sequence of how a frontend framework works, respecting **Virtual DOM, diffing, reconciliation, rendering, and efficient updates**.

---

## 1. Initialization

- App loads and creates the **root component**.
- Calls it once to **generate the initial Virtual DOM**.

```js
function App() {
  return h("div", { id: "app" },
    h("h1", null, "Hello World"),
    h("button", { onClick: increment }, "Count: " + state.count)
  );
}
```

Example Virtual DOM:

```js
{
  tag: "div",
  props: { id: "app" },
  children: [
    { tag: "h1", children: ["Hello World"] },
    { tag: "button", props: { onClick: increment }, children: ["Count: 0"] }
  ]
}
```

---

## 2. Rendering (Virtual DOM → Real DOM)

The framework converts the Virtual DOM into real DOM elements:

```js
function render(vnode) {
  const el = document.createElement(vnode.tag);
  for (let key in vnode.props) {
    if (key.startsWith("on")) {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    } else {
      el.setAttribute(key, vnode.props[key]);
    }
  }
  vnode.children.forEach(child => {
    el.appendChild(
      typeof child === "string" ? document.createTextNode(child) : render(child)
    );
  });
  vnode.el = el; // keep reference
  return el;
}
```

---

## 3. State Management

- Framework tracks data/state.
- Example:

```js
let state = { count: 0 };

function setState(newState) {
  state = { ...state, ...newState };
  update(); // trigger re-render
}
```

---

## 4. Event Handling

- User interactions trigger **state updates**.

```js
function increment() {
  setState({ count: state.count + 1 });
}
```

---

## 5. Re-rendering (New Virtual DOM)

- Framework regenerates a **new Virtual DOM** after state changes:

```js
function update() {
  const newVDOM = App();              // new tree
  const patches = diff(oldVDOM, newVDOM);
  patch(rootElement, patches);        // apply updates
  oldVDOM = newVDOM;                  // save new tree
}
```

---

## 6. Diffing (Comparing Old vs New Virtual DOM)

- Compares old & new nodes to produce **patches**.

```js
function diff(oldVNode, newVNode) {
  const patches = [];

  if (oldVNode.tag !== newVNode.tag) {
    patches.push({ type: "REPLACE", newVNode });
  } else {
    if (oldVNode.children[0] !== newVNode.children[0]) {
      patches.push({ type: "TEXT", text: newVNode.children[0] });
    }
  }
  return patches;
}
```

Example patch:

```js
[{ type: "TEXT", text: "Count: 1" }]
```

---

## 7. Reconciliation (Patching Real DOM)

- Applies only **minimal changes** to the DOM.

```js
function patch(domNode, patches) {
  patches.forEach(p => {
    switch (p.type) {
      case "REPLACE":
        const newEl = render(p.newVNode);
        domNode.parentNode.replaceChild(newEl, domNode);
        break;
      case "TEXT":
        domNode.textContent = p.text;
        break;
    }
  });
}
```

---

## 8. Complete Lifecycle Loop

```
APP STARTS
   │
   ▼
Create root Virtual DOM
   │
   ▼
Render Virtual DOM → DOM
   │
   ▼
Wait for user interaction
   │
   ▼
State changes (setState)
   │
   ▼
Build NEW Virtual DOM
   │
   ▼
Diff old vs new Virtual DOM
   │
   ▼
Apply Patches to Real DOM (Reconciliation)
   │
   ▼
UI Updated Efficiently!
```

---

## 9. Example Timeline of an Update

| Step | Action | Result |
|------|--------|--------|
| 1 | User clicks "Increment" | Event triggers `setState({count: 1})` |
| 2 | Framework calls `update()` | New Virtual DOM built |
| 3 | Diff old/new Virtual DOM | Detect `TEXT` change |
| 4 | Patch real DOM | Update only text node |
| 5 | DOM re-renders | UI shows “Count: 1” |

---

## 10. Full Minimal Framework Loop (Pseudo-code)

```js
let state = { count: 0 };
let oldVDOM = null;
let rootEl = null;

function h(tag, props, ...children) {
  return { tag, props: props || {}, children };
}

function App() {
  return h("div", { id: "app" },
    h("h1", null, "Counter"),
    h("button", { onClick: () => setState({ count: state.count + 1 }) },
      `Count: ${state.count}`)
  );
}

function setState(newState) {
  state = { ...state, ...newState };
  update();
}

function update() {
  const newVDOM = App();
  const patches = diff(oldVDOM, newVDOM);
  patch(rootEl, patches);
  oldVDOM = newVDOM;
}

function mount(vnode, container) {
  rootEl = render(vnode);
  container.appendChild(rootEl);
  oldVDOM = vnode;
}

mount(App(), document.body);
```

---

## ✅ Summary

- **Initialization:** Build first Virtual DOM tree.
- **Render:** Convert VDOM → real DOM.
- **State:** Store dynamic data.
- **Event:** Trigger updates.
- **Diffing:** Compare old & new VDOM.
- **Reconciliation:** Apply minimal changes.
- **Repeat:** Loop on every state change.

This flow ensures **efficient, declarative, predictable UI updates**.
