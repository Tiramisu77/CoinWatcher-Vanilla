import { utils } from "../utils.js"

export class ItemView {
    constructor(itemStrings, openDetails, orderIndex) {
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
        this.name = this.node.querySelector(".ticker")
        this.priceUSD = this.node.querySelector(".usd-price")
        this.priceBTC = this.node.querySelector(".btc-price")
        this.netUSD = this.node.querySelector(".netUSD")
        this.netBTC = this.node.querySelector(".net-btc")
        this.icon = this.node.querySelector(".coin-logo")
        this.changeUSD = this.node.querySelector(".change-usd")
        this.changeBTC = this.node.querySelector(".change-btc")
        this.changeNetUsd = this.node.querySelector(".net-usd-change")
        this.changeNetBTC = this.node.querySelector(".net-btc-change")

        if (itemStrings.name === "DOGE") {
            this.name.style["font-family"] = '"Comic Sans MS", cursive, sans-serif'
        }

        const name = itemStrings.name
        this.render(itemStrings)

        this.node.addEventListener(
            "click",
            () => {
                openDetails(name)
            },
            false
        )
    }

    renderPriceChanges(itemStrings) {
        this.changeUSD.textContent = itemStrings.changeUSDPerc.str
        this.changeUSD.style.color = itemStrings.changeUSDPerc.color
        this.changeNetUsd.textContent = itemStrings.netUSDchangeAbs.str
        this.changeNetUsd.style.color = itemStrings.netUSDchangeAbs.color
        this.changeBTC.textContent = itemStrings.changeBTCPerc.str
        this.changeBTC.style.color = itemStrings.changeBTCPerc.color
        this.changeNetBTC.textContent = itemStrings.netBTCchangeAbs.str
        this.changeNetBTC.style.color = itemStrings.netBTCchangeAbs.color
    }

    render(itemStrings) {
        if (itemStrings.icon) {
            this.icon.src = itemStrings.icon
            this.icon.style.display = "block"
        }
        this.amount.textContent = itemStrings.amount
        this.name.textContent = itemStrings.name
        this.priceUSD.textContent = itemStrings.priceUSD
        this.priceBTC.textContent = itemStrings.priceBTC
        this.netUSD.textContent = itemStrings.netUSD
        this.netBTC.textContent = itemStrings.netBTC
        this.renderPriceChanges(itemStrings)
    }
}
