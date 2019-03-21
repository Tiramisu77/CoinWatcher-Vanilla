import { utils } from "../utils.js"
export class TotalValue {
    constructor() {
        this.node = utils.createComponent(`
          <div id="networth">

          <div id="usd-container">

          <div id="usd-value" class="total-val">
          </div>
          <div>
          <span id="usd-change-perc" class="net-changes">
          </span>
          <span  class="net-changes">
          /
          </span>
          <span id="usd-change-abs" class="net-changes">
          </span>
          </div>

          </div>

          <div id="btc-container">
          <div id="btc-value" class="total-val">
          </div>
          <div>
          <span id="btc-change-perc" class="net-changes">
          </span>
          <span  class="net-changes">
          /
          </span>
          <span id="btc-change-abs" class="net-changes">
          </span>
          </div>
          </div>

          <div id="local-currency-container">
          </div>

          </div>`)
        this.usdValue = this.node.querySelector("#usd-value")
        this.usdChangePerc = this.node.querySelector("#usd-change-perc")
        this.usdChangeAbs = this.node.querySelector("#usd-change-abs")
        this.btcValue = this.node.querySelector("#btc-value")
        this.btcChangePerc = this.node.querySelector("#btc-change-perc")
        this.btcChangeAbs = this.node.querySelector("#btc-change-abs")
    }

    //todo rename btc and usd into main and second
    renderPriceChanges(printableTotalValue) {
        this.usdChangePerc.textContent = printableTotalValue.mainChangePerc.str
        this.usdChangePerc.style.color = printableTotalValue.mainChangePerc.color
        this.usdChangeAbs.textContent = printableTotalValue.mainCurrencyChangeAbs.str
        this.usdChangeAbs.style.color = printableTotalValue.mainCurrencyChangeAbs.color
        this.btcChangePerc.textContent = printableTotalValue.secondChangePerc.str
        this.btcChangePerc.style.color = printableTotalValue.secondChangePerc.color
        this.btcChangeAbs.textContent = printableTotalValue.secondCurrencyChangeAbs.str
        this.btcChangeAbs.style.color = printableTotalValue.secondCurrencyChangeAbs.color
    }
    render(printableTotalValue) {
        this.usdValue.textContent = printableTotalValue.mainCurrencyNet
        this.btcValue.textContent = printableTotalValue.secondCurrencyNet
        this.renderPriceChanges(printableTotalValue)
    }
}
