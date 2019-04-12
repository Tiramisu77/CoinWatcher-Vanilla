import { utils } from "../utils.js"
export class CurrencySelect {
    constructor() {
        this.node = utils.createComponent(`
          <select class="currency-select">
          </select>`)
    }
    render(currencies) {
        currencies.forEach(currency => {
            let elem = this.createOptionForCurrSelect(currency)
            this.node.appendChild(elem)
        })
    }

    renderDefault() {
        let supportedCurrencies = window.EE.request("supportedVersusCurrencies")
        this.render(supportedCurrencies)
    }
    selectCurrent(current) {
        this.node.querySelector(`[value="${current}"]`).selected = true
    }
    createOptionForCurrSelect(option) {
        let elem = document.createElement("option")
        elem.value = option
        elem.textContent = option
        return elem
    }
}
