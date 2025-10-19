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
    let oldVDOM = {
                    tag: "div",
                    props: { id: "app" },
                    children: [
                                {tag: "h1", children: ["Hello World"]},
                                {tag: "button", children: ["Count: 0"]}
                            ]
                }
    
    let newVDOM = {
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
export const Diff = (oldVDOM, newVDOM) => {
    let patches = []

    // Node doesn't exist - create it
    if (!oldVDOM) {
        patches.push({ type: "create", node: newVDOM })
        return patches
    }

    // Different tag types - replace the node
    if (oldVDOM.tag !== newVDOM.tag) {
        patches.push({ type: "replace", node: newVDOM })
        return patches
    }
    // Text content changed
    if (typeof oldVDOM.children?.[0] === "string" &&
        oldVDOM.children[0] !== newVDOM.children[0]) {
        patches.push({ type: "text", node: newVDOM, text: newVDOM.children[0]})
    }

    // Diff children recursively
    const maxLength = Math.max(
        oldVDOM.children?.length || 0,
        newVDOM.children?.length || 0
    )

    for (let i = 0; i < maxLength; i++) {
        const childPatches = Diff(oldVDOM.children?.[i], newVDOM.children?.[i])
        if (childPatches.length > 0) {
            patches.push(...childPatches)
        }
    }

    return patches

}

