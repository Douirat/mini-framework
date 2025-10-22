/* 
                            ----- Diffing -----
    Diffing is the process where a framework compares the old virtual DOM 
    with the new virtual DOM tree after the state changes.
    Goal: the figure out exactly what changed so the framework can update
    the real DOM efficiently without re-rendering everything.

                        --- Why Diff matters? ---
    Real DOM updates are expensive, changing the entire DOM on every state
    change causes reflows repaints and poor performance.
    ------> only update nodes that actually changed.
    How Diffing works step by step.


                        --- How Diffing works step by step? ---
    let oldnode = {
                    tag: "div",
                    props: { id: "app" },
                    children: [
                                {tag: "h1", children: ["Hello World"]},
                                {tag: "button", children: ["Count: 0"]}
                            ]
                }
    
    let newNode = {
                    tag: "div",
                    props: {id: "app"},
                    children: [
                    {tag: "h1", children: ["Hello World"]},
                    {tag: "button", children: ["Count: 1"]}
                    ]
                }

                    -- step1: compare tags.
    check if the node types are the same(div, h1, button).
    <1> if the tags are different -> (replace the whle node).
    <2> if the tags are the same -> proceed to check props and children.

                    -- step2: compare props.
    compare all the attributes like (id, class, style, onclick...)
    <> if props differ -> update only the changed props on the real DOM.

                    -- step3: compare children:
    Text nodes:
    <> if children are strings (text), compare them.
    <> if text differs -> update text content only.
*/

// compare the old virtual dom with the new virtual DOM.
export const Diff = (oldNode, newNode) => {
    if (!oldNode) return { type: "create", node: newNode }
    if (!newNode) return { type: "remove" }
    if (oldNode?.tag != newNode?.tag) return { type: "replace", node: newNode }
    if (!oldNode.tag && !newNode.tag && oldNode !== newNode) return { type: 'text', text: newNode };

 
    if (oldNode.attrs && newNode.attrs) {
        for (let key in newNode.attrs) {
            if (newNode.attrs[key] !== oldNode.attrs[key]) {
                return {type: "attributes", node: newNode}
            }
        }
    }
  

    const patches = []
    const childLength = Math.max(oldNode.children.length, newNode.children.length);
    for (let i = 0; i < childLength; i++) {
        patches.push(Diff(oldNode?.children[i], newNode?.children[i]))
    }
    if (patches.length > 0) {
        return { type: "update", childs: patches }
    }
}

