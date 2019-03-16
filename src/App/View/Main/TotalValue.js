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

    renderPriceChanges(printableTotalValue) {
        this.usdChangePerc.textContent = printableTotalValue.USDchangePerc.str
        this.usdChangePerc.style.color = printableTotalValue.USDchangePerc.color
        this.usdChangeAbs.textContent = printableTotalValue.USDchangeAbs.str
        this.usdChangeAbs.style.color = printableTotalValue.USDchangeAbs.color
        this.btcChangePerc.textContent = printableTotalValue.BTCchangePerc.str
        this.btcChangePerc.style.color = printableTotalValue.BTCchangePerc.color
        this.btcChangeAbs.textContent = printableTotalValue.BTCchangeAbs.str
        this.btcChangeAbs.style.color = printableTotalValue.BTCchangeAbs.color
    }
    render(printableTotalValue) {
        this.usdValue.textContent = printableTotalValue.USD
        this.btcValue.textContent = printableTotalValue.BTC
        this.renderPriceChanges(printableTotalValue)
    }
}
