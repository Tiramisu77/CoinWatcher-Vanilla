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
        this.symbol = this.node.querySelector(".ticker")
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
        this.render(itemStrings)

        this.node.addEventListener(
            "click",
            () => {
                openDetails(id)
            },
            false
        )
    }

    /*
    {
        name,
        fullName,
        icon,
        amount,
        priceMain,
        netMain,
        changeMainPerc,
        changeMainAbs,
        priceSecond,
        netSecond,
        changeSecondPerc,
        changeSecondAbs,
    }
    */

    /*
todo change btc and usd into main and second
    */

    renderPriceChanges(itemStrings) {
        this.changeUSD.textContent = itemStrings.changeMainPerc.str
        this.changeUSD.style.color = itemStrings.changeMainPerc.color
        this.changeNetUsd.textContent = itemStrings.changeMainAbs.str
        this.changeNetUsd.style.color = itemStrings.changeMainAbs.color
        this.changeBTC.textContent = itemStrings.changeSecondPerc.str
        this.changeBTC.style.color = itemStrings.changeSecondPerc.color
        this.changeNetBTC.textContent = itemStrings.changeSecondAbs.str
        this.changeNetBTC.style.color = itemStrings.changeSecondAbs.color
    }

    render(itemStrings) {
        if (itemStrings.icon) {
            this.icon.src = itemStrings.icon
            this.icon.style.display = "block"
        }
        this.amount.textContent = itemStrings.amount
        this.symbol.textContent = itemStrings.symbol || itemStrings.id
        this.priceUSD.textContent = itemStrings.priceMain
        this.priceBTC.textContent = itemStrings.priceSecond
        this.netUSD.textContent = itemStrings.netMain
        this.netBTC.textContent = itemStrings.netSecond
        this.renderPriceChanges(itemStrings)
    }
}
