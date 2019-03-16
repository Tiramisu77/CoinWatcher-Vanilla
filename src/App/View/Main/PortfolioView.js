import { utils } from "../utils.js"

import { ItemView } from "./ItemView.js"

import "./css/portfolio.css"

export class PortfolioView {
    constructor(openDetails) {
        this.node = utils.createNode({
            tag: "div",
            id: "portfolio",
            cssClass: "table",
        })

        this.openDetails = openDetails

        this.items = {}
    }

    addItem(itemStrings, orderIndex) {
        let newItem = new ItemView(itemStrings, this.openDetails, orderIndex)
        this.items[itemStrings.name] = newItem
        this.node.appendChild(newItem.node)
    }

    removeItem(itemName) {
        this.node.removeChild(this.items[itemName].node)
        delete this.items[itemName]
    }

    sortView(order) {
        order.forEach((item, index) => {
            this.items[item].node.style.order = index + 1
        })
    }
}
