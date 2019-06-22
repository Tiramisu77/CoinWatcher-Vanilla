import { utils } from "../utils.js"

export class ItemView {
    constructor(itemStrings, openDetails, orderIndex, printableDataVsAll) {
        this.node = utils.createNode({
            tag: "div",
            cssClass: "table-row",
            innerHTML: `
    <div class="table-cell ticker-container">
    <div class="l-t-a">
    <img class="coin-logo" alt="">
    <div class="ticker"></div>
    <div class="amount"></div>
    </div>
    </div>

    <div class="table-cell item-prices">
    <div class="usd-price"></div>
    <div class="change-usd"></div>
    <div class="btc-price"></div>
    <div class="change-btc"></div>
    </div>

    <div class="table-cell item-values">
    <div class="netUSD"></div>
    <div class="net-usd-change"> </div>
    <div class="net-btc"></div>
    <div class="net-btc-change"> </div>

    </div>
    `,
        })
        this.node.style.order = orderIndex
        this.amount = this.node.querySelector(".amount")
        this.symbol = this.node.querySelector(".ticker")

        this.itemPrices = this.node.querySelector(".item-prices")
        this.itemNetValues = this.node.querySelector(".item-values")

        this.priceUSD = this.node.querySelector(".usd-price")
        this.priceBTC = this.node.querySelector(".btc-price")
        this.netUSD = this.node.querySelector(".netUSD")
        this.netBTC = this.node.querySelector(".net-btc")
        this.icon = this.node.querySelector(".coin-logo")
        this.changeUSD = this.node.querySelector(".change-usd")
        this.changeBTC = this.node.querySelector(".change-btc")
        this.changeNetUsd = this.node.querySelector(".net-usd-change")
        this.changeNetBTC = this.node.querySelector(".net-btc-change")

        if (itemStrings.name === "doge") {
            this.symbol.style["font-family"] = '"Comic Sans MS", cursive, sans-serif'
        }

        const id = itemStrings.id
        this.render(itemStrings, printableDataVsAll)

        this.node.addEventListener(
            "click",
            () => {
                openDetails(id)
            },
            false
        )
    }

    render(itemStrings) {
        let printableDataVsAll = window.EE.request("printableDataVsAll", itemStrings.id)

        if (printableDataVsAll.icon) {
            this.icon.src = printableDataVsAll.icon
            this.icon.style.display = "block"
        }
        this.amount.textContent = printableDataVsAll.amount
        this.symbol.textContent = printableDataVsAll.symbol || printableDataVsAll.id

        window.lib.wipeChildren(this.itemPrices)
        window.lib.wipeChildren(this.itemNetValues)
        printableDataVsAll.versusData.forEach(data => {
            this.renderVersusData(data)
        })
    }

    renderVersusData(data) {
        let { price, changePerc, changeAbs, net } = data

        let priceNode = document.createElement("div")
        priceNode.textContent = price

        let changePercNode = document.createElement("div")
        changePercNode.textContent = changePerc.str
        changePercNode.style.color = changePerc.color

        let changeAbsNode = document.createElement("div")
        changeAbsNode.textContent = changeAbs.str
        changeAbsNode.style.color = changeAbs.color

        let netNode = document.createElement("div")
        netNode.textContent = net

        this.itemPrices.appendChild(priceNode)
        this.itemPrices.appendChild(changePercNode)

        this.itemNetValues.appendChild(netNode)
        this.itemNetValues.appendChild(changeAbsNode)
    }
}
