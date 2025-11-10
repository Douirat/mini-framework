import {todoVDOM} from './TODO/components/todo.js'

import {App} from "./lite_framework/router.js"
const router = {
    path: "/",
    Component: todoVDOM
}

export const app = new App(router)
app.init()
// app.dispatch(todoVDOM)