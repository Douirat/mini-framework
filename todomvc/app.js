import FacileJS from '../framework/index.js';


function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const initialState = {
  todos: [],
  filter: 'all', 
  editing: null, 
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: uuid(), title: action.payload, completed: false }],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'DESTROY_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'START_EDITING':
      return { ...state, editing: action.payload };
    case 'CANCEL_EDITING':
      return { ...state, editing: null };
    case 'FINISH_EDITING':
      return {
        ...state,
        editing: null,
        todos: state.todos.map(todo =>
          todo.id === state.editing ? { ...todo, title: action.payload } : todo
        ),
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    case 'TOGGLE_ALL':
        const areAllCompleted = state.todos.every(todo => todo.completed);
        return {
            ...state,
            todos: state.todos.map(todo => ({...todo, completed: !areAllCompleted}))
        };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}


function HeaderComponent() {
  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      const title = e.target.value.trim();
      if (title.length > 1) {
        store.dispatch({ type: 'ADD_TODO', payload: title });
        e.target.value = '';
      }
    }
  };

  return FacileJS.createElement('header', { class: 'header' },
    FacileJS.createElement('h1', {}, 'todos'),
    FacileJS.createElement('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      onkeyup: handleKeyDown,
    })
  );
}

function TodoItemComponent({ todo, isEditing }) {
  const handleToggle = () => store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  const handleDestroy = () => store.dispatch({ type: 'DESTROY_TODO', payload: todo.id });
  const handleStartEditing = () => store.dispatch({ type: 'START_EDITING', payload: todo.id });

  const handleFinishEditing = e => {
    if (e.keyCode === ENTER_KEY) {
      const title = e.target.value.trim();
      if (title.length > 1) {
        store.dispatch({ type: 'FINISH_EDITING', payload: title });
      }
    } else if (e.keyCode === ESCAPE_KEY) {
      store.dispatch({ type: 'CANCEL_EDITING' });
    }
  };

  const liClass = `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`;

  return FacileJS.createElement('li', { class: liClass, 'data-id': todo.id },
    FacileJS.createElement('div', { class: 'view' },
      FacileJS.createElement('input', { class: 'toggle', type: 'checkbox', checked: todo.completed, onchange: handleToggle }),
      FacileJS.createElement('label', { ondblclick: handleStartEditing }, todo.title),
      FacileJS.createElement('button', { class: 'destroy', onclick: handleDestroy })
    ),
    isEditing && FacileJS.createElement('input', {
      class: 'edit',
      value: todo.title,
      onkeydown: handleFinishEditing,
      onblur: () => store.dispatch({ type: 'CANCEL_EDITING' }),
      ref: (input) => input && input.focus(),
    })
  );
}

function MainComponent({ todos, filter, editing }) {
    const visibleTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const allCompleted = todos.every(t => t.completed);

    if (todos.length === 0) {
        return null;
    }

    return FacileJS.createElement('section', { class: 'main' },
        FacileJS.createElement('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox', checked: allCompleted, onchange: () => store.dispatch({type: 'TOGGLE_ALL'}) }),
        FacileJS.createElement('label', { for: 'toggle-all' }, 'Mark all as complete'),
        FacileJS.createElement('ul', { class: 'todo-list' },
            ...visibleTodos.map(todo => TodoItemComponent({ todo, isEditing: editing === todo.id }))
        )
    );
}

function FooterComponent({ todos, filter }) {
  if (todos.length === 0) {
    return null;
  }

  const activeCount = todos.filter(t => !t.completed).length;
  const itemText = activeCount === 1 ? 'item' : 'items';

  return FacileJS.createElement('footer', { class: 'footer' },
    FacileJS.createElement('span', { class: 'todo-count' },
      FacileJS.createElement('strong', {}, activeCount), ` ${itemText} left`
    ),
    FacileJS.createElement('ul', { class: 'filters' },
      FacileJS.createElement('li', {}, FacileJS.createElement('a', { href: '#/', class: filter === 'all' ? 'selected' : '' }, 'All')),
      FacileJS.createElement('li', {}, FacileJS.createElement('a', { href: '#/active', class: filter === 'active' ? 'selected' : '' }, 'Active')),
      FacileJS.createElement('li', {}, FacileJS.createElement('a', { href: '#/completed', class: filter === 'completed' ? 'selected' : '' }, 'Completed'))
    ),
    FacileJS.createElement('button', { class: 'clear-completed', onclick: () => store.dispatch({ type: 'CLEAR_COMPLETED' }) }, 'Clear completed')
  );
}

function App() {
  const state = store.getState();
  const { todos, filter, editing } = state;
  return FacileJS.createElement('div', {},
    FacileJS.createElement('section', { class: 'todoapp' },
      HeaderComponent(),
      MainComponent({ todos, filter, editing }),
      FooterComponent({ todos, filter })
    ),
    FacileJS.createElement('footer', { class: 'info' },
      FacileJS.createElement('p', {}, 'Double-click to edit a todo'),
      FacileJS.createElement('p', {}, 'Created by Jules'),
      FacileJS.createElement('p', {}, 'Part of TodoMVC')
    )
  );
}

const store = FacileJS.createStore(reducer);
const rootElement = document.getElementById('root');

const update = FacileJS.createApp(App, rootElement);
store.subscribe(update);

FacileJS.createRouter(store);
