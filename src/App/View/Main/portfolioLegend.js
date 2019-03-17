import { utils } from "../utils.js"

export class PortfolioLegend {
    constructor(table, actions) {
        this.node = utils.createNode({
            tag: "div",
            cssClass: "legend-container",
            innerHTML: `
            <div class="table-row legend">
        <div class="table-cell"> <span class="coinL">coin ⇵</span></div>
          <div class="table-cell"><span class="pricesL"> prices ⇵</span></div>
             <div class="table-cell"><span class=" valueL">value ⇵ </span></div>
             </div>
      `,
            appendTo: table,
        })

        this.resetArrows = this.resetArrows.bind(this)
        this.coin = this.node.querySelector(".coinL")
        this.prices = this.node.querySelector(".pricesL")
        this.value = this.node.querySelector(".valueL")

        this.state = {
            coin: "alphaAsc",
            prices: "marketcapDesc",
            value: "netvalDesc",
        }

        this.coin.addEventListener("click", () => {
            this.resetArrows()
            if (this.state.coin === "alphaAsc") {
                actions.sortByAlphaAsc()
                this.coin.textContent = "coin ↑"
                this.state.coin = "alphaDsc"
            } else if (this.state.coin === "alphaDsc") {
                this.coin.textContent = "coin ↓"
                actions.sortByAlphaDsc()
                this.state.coin = "alphaAsc"
            }
        })
        this.prices.addEventListener("click", () => {
            this.resetArrows()
            if (this.state.prices === "marketcapAsc") {
                this.prices.textContent = "prices ↑"
                actions.sortByMcapAsc()
                this.state.prices = "marketcapDesc"
            } else if (this.state.prices === "marketcapDesc") {
                this.prices.textContent = "prices ↓"
                actions.sortByMcapDsc()
                this.state.prices = "marketcapAsc"
            }
        })
        this.value.addEventListener("click", () => {
            this.resetArrows()
            if (this.state.value === "netvalAsc") {
                this.value.textContent = "value ↑"
                actions.sortByNetvalAsc()
                this.state.value = "netvalDesc"
            } else if (this.state.value === "netvalDesc") {
                this.value.textContent = "value ↓"
                actions.sortByNetvalDsc()
                this.state.value = "netvalAsc"
            }
        })
    }

    renderInit(currSetting) {
        switch (currSetting) {
            case "alphaAsc":
                this.coin.textContent = "coin ↑"
                break
            case "alphaDsc":
                this.coin.textContent = "coin ↓"
                break
            case "mcapAsc":
                this.prices.textContent = "prices ↑"
                break
            case "mcapDsc":
                this.prices.textContent = "prices ↓"
                break
            case "netvalAsc":
                this.value.textContent = "value ↑"
                break
            case "netvalDsc":
                this.value.textContent = "value ↓"
                break
        }
    }

    resetArrows() {
        this.coin.textContent = "coin ⇵"
        this.prices.textContent = "prices ⇵"
        this.value.textContent = "value ⇵"
    }
}
