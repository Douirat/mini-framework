export const delete_child = (parent, id) => {
    // If the parent itself is the target, handle externally (cannot reassign parent directly)
    if (parent.key === id) {
        return null; // caller should handle removing parent from its own parent
    }

    if (!parent.children) return parent;

    // Iterate over children safely
    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child.key === id) {
            parent.children.splice(i, 1); // remove child
            return parent; // done, stop recursion
        } else {
            delete_child(child, id); // recurse
        }
    }

    return parent;
};

export const append_child = (parent, newChild, parentKey) => {
    // If this node is the target parent
    if (parent.key === parentKey) {
        if (!parent.children) parent.children = [];
        parent.children.push(newChild);
        return true; // insertion done
    }

    // Otherwise, recurse through children
    if (parent.children) {
        for (let child of parent.children) {
            if (append_child(child, newChild, parentKey)) {
                return true; // stop once inserted
            }
        }
    }

    return false; // parent not found in this branch
};


// a function to append an event to
