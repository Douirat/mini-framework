import { virtualize } from "../abstraction.js";

export const notFound = virtualize("div", { id: "not-found", class: "container" }, [
    virtualize("header", { class: "app-header" }, [
        virtualize("h2", { class: "framework-name" }, ["Framework Lite"])
    ]),
    virtualize("h1", { class: "title" }, ["404"]),
    virtualize("p", { class: "message" }, ["Oops! The page you are looking for does not exist."]),
    virtualize("a", { href: "/", class: "home-link" }, ["Go back home"])
]);
