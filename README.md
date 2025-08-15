# Facile.js: A Simple Frontend Framework

## Introduction

Facile.js is a lightweight, from-scratch JavaScript framework for building single-page applications. It was created as an educational project to demonstrate and understand the core principles behind modern frontend frameworks. It includes a Virtual DOM, a centralized state management system, and a hash-based router.

This repository contains both the framework itself (in the `/framework` directory) and a sample TodoMVC application (in the `/todomvc` directory) built with it.

## Core Features

### 1. DOM Abstraction (Virtual DOM)

You describe your UI using `createElement`, a function that returns JavaScript objects called "virtual nodes" (VNodes). The framework's `render` function then turns this virtual representation into real, live DOM elements. On every state change, the application is re-rendered to reflect the new state.

### 2. State Management (Redux-like Store)

The framework provides a single, centralized "store" to hold the entire state of your application. This enables a predictable, one-way data flow: an action is dispatched, a pure "reducer" function calculates the new state, and the UI is re-rendered.

### 3. Event Handling

To meet the project's strict requirement of providing a new way to handle events, this framework **avoids `addEventListener` entirely**. Instead, event handlers are assigned directly to element properties during the rendering process (e.g., `element.onclick = yourFunction`). This is a simple and direct way to handle user interactions.

### 4. Routing System

A simple router uses the `window.onhashchange` property to listen for URL hash changes (e.g., `/#/active`). When the URL changes, the router dispatches an action to the store, allowing the application's state to be synchronized with the URL. This also avoids using `addEventListener`.

## How to Use Facile.js

### Creating and Rendering Elements

Use `createElement` to define your UI. The `props` object can contain any standard HTML attribute.

```javascript
import { createElement } from './framework/dom.js';

// Create a VNode
const greeting = createElement('h1', { class: 'greeting' }, 'Hello, World!');

// To render it, define a component and use createApp
import { createApp } from './framework/dom.js';

function MyComponent() {
  return createElement('div', {}, 'My first component!');
}

const rootElement = document.getElementById('root');
createApp(MyComponent, rootElement); // Mounts the component
```

### Handling Events

Event handlers are functions passed as `on...` properties in the `props` object.

```javascript
function MyButton() {
  const handleClick = () => {
    alert('Button was clicked!');
  };

  // The 'onclick' property will be directly assigned to the button element.
  return createElement('button', {
    class: 'my-button',
    onclick: handleClick
  }, 'Click Me');
}
```

### Managing State

This example shows the full one-way data flow.

```javascript
import { createStore } from './framework/state.js';
import { createApp, createElement } from './framework/dom.js';

// 1. Define initial state and a reducer
const initialState = { count: 0 };
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}

// 2. Create the store
const store = createStore(reducer);

// 3. Create a component that uses the state
function CounterComponent() {
  const state = store.getState();

  const handleIncrement = () => {
    store.dispatch({ type: 'INCREMENT' });
  };

  return createElement('div', {},
    createElement('h1', {}, `Count: ${state.count}`),
    createElement('button', { onclick: handleIncrement }, '+')
  );
}

// 4. Connect everything
const rootElement = document.getElementById('root');
const update = createApp(CounterComponent, rootElement);

// Subscribe the UI to re-render whenever the state changes
store.subscribe(update);
```
