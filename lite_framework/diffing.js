/*
--------------> Diffing <--------------
    Diffing is where a rendering system becomes efficient, 
    because it is the process of comparing the old virtual
    DOM and the new virtual DOM trees and producing a minimal
    set of operation(patches that transform the real DOM from
    the old state to the new state).
        Because manipulating the real DOM is relatively expensive. if you
        can compute only what changed, you avoid unnecessary DOM operations.
    ---> What patch can be?
        <> create
        <> remove: delete
        <> replace: node (create new DOM node and substitute)
        <> update_props: (add/remove/change attributes, event listeners)
        <> text_update
        <> move: reorder child nodes _ usually in keyed lists.



    --> Higher level diffing strategy (reconciliation):
        1. Compare nodes by type(tag name, component identity)
            -> if types differ / replace the whole node.
        2. if the same type:
            -> Diff props/attributes / produce update_props.
            -> Diff children recursively reconcile children.
        3. for children:
            -> if children are simple (text only) / text_update.
            -> if children are lists/ arrays / use list diffing strategies(keys matter)

        Simple recursive diff (pseudo-algorithm)
        diff(oldNode, newNode):
            if oldNode == null:
                produce CREATE(newNode)
            else if newNode == null:
                produce REMOVE(oldNode)
            else if nodeTypesDiffer(oldNode, newNode):
                produce REPLACE(oldNode, newNode)
            else:
                produce UPDATE_PROPS(diffProps(oldNode.props, newNode.props))
                diffChildren(oldNode.children, newNode.children)



    <><><> Reconciliation: is the process where your viirtual DOM determines how to update the real DOM efficiently when something changes in your app:
        When you re-render your UI, you get a new virtual tree that needs to be compared to the previous one:
        The framework needs to decide:
        <> Which eements are unchanged (reuse them)
        <> Which elements are new (create them)
        <> which elements are gone (remove them)
        <> which elements are removed (reorder them)
*/