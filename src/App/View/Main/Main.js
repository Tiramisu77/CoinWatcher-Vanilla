import { PortfolioView } from "./PortfolioView.js"

import { TotalValue } from "./TotalValue.js"

import { utils } from "../utils.js"

import { PortfolioLegend } from "./PortfolioLegend.js"

import { ChangePeriodButtons } from "./ChangePeriodButtons.js"

export class Main {
    constructor(actions) {
        this.node = utils.createNode({ tag: "div", id: "main" })

        this.TotalValue = new TotalValue()
        this.node.appendChild(this.TotalValue.node)

        this.PortfolioLegend = new PortfolioLegend(this.node, actions)

        this.PortfolioView = new PortfolioView(actions.openDetails)
        this.node.appendChild(this.PortfolioView.node)

        this.ChangePeriodButtons = new ChangePeriodButtons(actions.switchPriceChangePeriod, this.node)
    }
}
