export class VNode {

    // JavaScript representation of a DOM node:
    /**
     *@attribute type:
     *The type of node.
     *For an element:
     *div
     *p
     *h1
     *button
     *input
     *img
     *You can also eventually represent other node types such as:
     *text
     *fragments
     *components
     *So type is more general than simply "tag name."
     */
    type;


    /**
    * @attribute properties:
    *Everything describing how the element should behave or appear.

    *This is where your { class, id, ... } idea belongs.

    *It can contain:

    *HTML attributes
    *id
    *class
    *title
    *href
    *src
    *alt
    *name
    *value
    *type
    *disabled
    *etc.
    *DOM properties

    *Some things are more naturally DOM properties than HTML attributes:

    *value
    *checked
    *selected
    *disabled
    *hidden

    *Your framework can initially treat them all as props; later you can distinguish them internally.

    *Event handlers

    *Your idea is correct, but I would not conceptually consider events attributes.

    *Think:

    *props

    *attributes/properties
    *event handlers

    *For example, conceptually:

    *props → { attributes/properties, events }

    *or, if you want a simpler first implementation, everything can live together in props.
    */
    properties;

    /**
     *@attributes events:
     *Since javascript is an object oriented language the DOM element is expected to have an event covering the user's
     *interaction with my application associated with it like a (click, hover, ...etc)
     */
    events;

    /**
    * @attributes children:
    * Yes — exactly as you described.
    *children represents the contents nested inside the node.

    *For example:

    → div
    → h1
    → p
    → button

    Each child is itself another virtual node.

    So you get a recursive structure:

    VNode

    → children: VNode[]
    → each VNode
    → children: VNode[]
    → etc.

    *This recursive structure is what makes it possible to represent the entire UI as a tree.
     */
    children;

    /**
     *since we are having a full representation to the DOM element, the element could have a text associated to it and
     * this attribute will make it easier to insert the text to the DOM.
     */
    text


}