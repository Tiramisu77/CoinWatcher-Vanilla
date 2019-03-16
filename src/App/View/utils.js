//old
const createNode = function({ tag, innerHTML, id, cssClass, appendTo }) {
    const node = document.createElement(tag)
    if (innerHTML) node.innerHTML = innerHTML
    if (id) node.id = id
    if (cssClass) node.classList.add(...cssClass.split(" "))
    if (appendTo) appendTo.appendChild(node)
    return node
}

//new
const createComponent = function(template, parent) {
    const elem = new DOMParser().parseFromString(template, "text/html").body.firstChild
    if (parent) parent.appendChild(elem)
    return elem
}

export const utils = { createNode, createComponent }
