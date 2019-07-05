import { utils } from "../utils.js"
import "./css/CoinDetails.css"
import { bell, trashcan } from "./icons.js"
import { CurrencySelect } from "./CurrencySelect.js"
class AddAlert {
    constructor(closeModal, rerenderAlerts) {
        this.node = utils.createComponent(`
      <div class="add-alert-modal">

      <div>
      Alert type:
      </div>


      <select class="alert-type">
      <option value="price"> Price</option>
      <option value="perc"> Percentage</option>
      </select>


      <label for="target-alert-inp" class="type-price"> Price:</label>
      <input class="type-price inp" autocomplete="off" type="number" name="amount" id="target-alert-inp"  size=16></input>


      <label class="type-perc" for="perc-alert-inp"> Percentage change:</label>
      <input class="type-perc inp" autocomplete="off" type="number" name="amount" id="perc-alert-inp"  size=16></input>

      <div class="type-perc">Period: </div>

      <select class="period-select type-perc">
      <option value="1h"> 1h</option>
      <option value="24h"> 24h</option>
      <option value="7d"> 7d</option>
      </select>

      <div>
      Currency:
      </div>


      <div class="currency-select-container">
      </div>


      <div class="btn cancel"> cancel </div> <div class="btn ok"> ok </div>
      </div>
      `)
        this.id = null
        this.alertType = this.node.querySelector(".alert-type")
        this.priceInput = this.node.querySelector("input.type-price")
        this.changeInput = this.node.querySelector("input.type-perc")
        this.changePeriod = this.node.querySelector(".period-select")
        this.currencySelect = new CurrencySelect()
        this.node.querySelector(".currency-select-container").appendChild(this.currencySelect.node)

        this.cancel = this.node.querySelector(".cancel")
        this.ok = this.node.querySelector(".ok")

        this.alertType.addEventListener("change", () => {
            let type = this.alertType.value
            if (type === "price") {
                this.node.querySelectorAll(".type-price").forEach(e => (e.style.display = "block"))
                this.node.querySelectorAll(".type-perc").forEach(e => (e.style.display = "none"))
            } else {
                this.node.querySelectorAll(".type-price").forEach(e => (e.style.display = "none"))
                this.node.querySelectorAll(".type-perc").forEach(e => (e.style.display = "block"))
            }
        })

        this.ok.addEventListener("click", () => {
            let type = this.alertType.value
            let data = { type }

            if (type === "price") {
                data.target = Number(this.priceInput.value)
            } else {
                data.percChange = this.changeInput.value
                data.period = this.changePeriod.value
            }

            data.coinId = this.id
            data.currency = this.currencySelect.node.value
            window.EE.emit("addNotification", data)
            rerenderAlerts(this.id)
            closeModal()
        })

        this.cancel.addEventListener("click", () => {
            closeModal()
        })

        this.currencySelect.node.addEventListener("change", () => {
            this.renderPriceInput(this.currencySelect.node.value)
        })
    }

    render(id) {
        this.renderCurrencySelects()
        this.alertType.dispatchEvent(new Event("change"))
        this.id = id
        this.renderPriceInput()
    }

    renderPriceInput(currency) {
        let marketData = window.EE.request("itemApiData", this.id).market_data

        if (!currency) {
            currency = window.EE.request("settings").currentCurrencies.main
        }

        this.priceInput.value = window.lib.toFixedCurrency(marketData.current_price[currency.toLowerCase()])
    }

    renderCurrencySelects() {
        let supportedCurrencies = window.EE.request("supportedVersusCurrencies")
        let currentCurrency = window.EE.request("settings").currentCurrencies.main
        this.currencySelect.render(supportedCurrencies)
        this.currencySelect.selectCurrent(currentCurrency)
    }
}

class Alerts {
    constructor(parent, modalContainer) {
        this.node = utils.createComponent(
            `
      <div class="coin-details-alerts">

        <div class="alert-title">Alerts ${bell}</div>
        <div class="alert-container">
        <div class="price-alerts-container"> </div>
<div class="perc-alerts-container"> </div>
        <div> </div>
        </div>
        <div class="errormsg" style="color:red; justify-self:center"> </div>
         <div class="add-alert btn" style="justify-self:center; width:80px">new alert</div>
      </div>`,
            parent
        )

        this.modalContainer = modalContainer
        this.coinId = null
        this.errorMsg = this.node.querySelector(".errormsg")

        this.addAlert = new AddAlert(() => {
            this.modalContainer.innerHTML = ""
            this.modalContainer.style.display = "none"
        }, this.render.bind(this))

        this.percAlertTemplate = `
        <div class="perc-alert">
        <div>Change:</div>
        <input class="inp" autocomplete="off" type="number" name="percentage"  size=16></input>
        <div>%</div>
        <select class="period-select">
        <option value="1h"> 1h</option>
        <option value="24h"> 24h</option>
        <option value="7d"> 7d</option>
        </select>
        <div class="currency-container"> </div>
        <div class="remove-X clickable">×</div>
        </div>`
        this.percAlertContainer = this.node.querySelector(".perc-alerts-container")

        this.priceAlertTemplate = `
        <div class="price-alert">
        <div>Price:</div>
        <input class="inp" autocomplete="off" type="number" name="amount"  size=16></input>
        <div class="currency-container"> </div>
        <div class="remove-X clickable">×</div>

        </div>`
        this.priceAlertsContainer = this.node.querySelector(".price-alerts-container")

        this.node.querySelector(".add-alert").addEventListener("click", () => {
            if (!("Notification" in window)) {
                this.errorMsg.textContent = "Notifications are not supported in your browser"
                return
            }
            if (Notification.permission !== "granted") {
                Notification.requestPermission()
                this.errorMsg.textContent = "Please enable notifications"
                return
            }
            if (!("market_data" in window.EE.request("itemApiData", this.coinId))) {
                this.errorMsg.textContent = "Alerts are not available for this coin"
                return
            }
            this.errorMsg.textContent = ""

            this.modalContainer.innerHTML = ""
            this.modalContainer.appendChild(this.addAlert.node)
            this.modalContainer.style.display = "grid"
            this.addAlert.render(this.coinId)
        })
    }

    render(coinId) {
        this.errorMsg.textContent = ""
        this.modalContainer.style.display = "none"
        this.coinId = coinId
        window.lib.wipeChildren(this.priceAlertsContainer)
        window.lib.wipeChildren(this.percAlertContainer)
        let alerts = window.EE.request("allAlerts", coinId)
        alerts.forEach(alert => {
            if (alert.type === "price") {
                this.renderPriceAlert(alert)
            }
            if (alert.type === "perc") {
                this.renderPercAlert(alert)
            }
        })
    }

    renderPercAlert(percAlert) {
        let elem = utils.createComponent(this.percAlertTemplate)
        elem.querySelector("input").value = percAlert.percChange
        elem.querySelector("input").addEventListener("change", ev => {
            percAlert.percChange = Number(ev.target.value)
            percAlert.lastNotification = 0
            window.EE.emit("updateNotification")
        })

        elem.querySelector("select").querySelector(`[value="${percAlert.period}"]`).selected = true
        elem.querySelector("select").addEventListener("change", ev => {
            percAlert.period = ev.target.value
            percAlert.lastNotification = 0
            window.EE.emit("updateNotification")
        })
        elem.querySelector(".remove-X").addEventListener("click", () => {
            window.EE.emit("removeNotification", percAlert)
            this.percAlertContainer.removeChild(elem)
        })
        let currencySelect = new CurrencySelect()
        elem.querySelector(".currency-container").appendChild(currencySelect.node)
        currencySelect.renderDefault()
        currencySelect.selectCurrent(percAlert.currency)
        currencySelect.node.addEventListener("change", () => {
            percAlert.lastNotification = 0
            percAlert.currency = currencySelect.node.value
            window.EE.emit("updateNotification")
        })

        elem.dataset.coinId = percAlert.coinId
        elem.dataset.notifId = percAlert.notifId
        this.percAlertContainer.appendChild(elem)
    }

    renderPriceAlert(priceAlert) {
        let elem = utils.createComponent(this.priceAlertTemplate)

        let currencySelect = new CurrencySelect()
        elem.querySelector(".currency-container").appendChild(currencySelect.node)
        currencySelect.renderDefault()
        currencySelect.selectCurrent(priceAlert.currency)
        currencySelect.node.addEventListener("change", () => {
            priceAlert.currency = currencySelect.node.value
            window.EE.emit("updateNotification")
        })

        elem.querySelector("input").value = priceAlert.target
        elem.querySelector("input").addEventListener("change", ev => {
            priceAlert.target = Number(ev.target.value)
            let marketData = window.EE.request("itemApiData", priceAlert.coinId).market_data
            priceAlert.priceOnCreation = marketData.current_price[priceAlert.currency.toLowerCase()]
            priceAlert.targetIsHigher = priceAlert.target > priceAlert.priceOnCreation

            window.EE.emit("updateNotification")
        })
        elem.querySelector(".remove-X").addEventListener("click", () => {
            window.EE.emit("removeNotification", priceAlert)
            this.priceAlertsContainer.removeChild(elem)
        })
        elem.dataset.coinId = priceAlert.coinId
        elem.dataset.notifId = priceAlert.notifId
        this.priceAlertsContainer.appendChild(elem)
    }
}

class MarketDataDetails {
    constructor() {
        this.node = utils.createComponent(`
      <div class="market-data-details">

      <div class="k">Price:</div>  <div class="v details-prices"> </div>

      <div class="k">ATH:</div> <div class="v details-aths"> </div>

      <div class="k">Marketcap:</div> <div class="v details-mcaps"> </div>

      </div>
      `)

        this.prices = this.node.querySelector(".details-prices")
        this.aths = this.node.querySelector(".details-aths")
        this.mcaps = this.node.querySelector(".details-mcaps")
    }

    renderPrices(data) {
        let node = utils.createComponent(`
    <div class="v"> </div>
    `)
        node.textContent = data.price

        this.prices.appendChild(node)
    }

    renderAths(data) {
        let node = utils.createComponent(`
  <div class="v"> </div>
  `)
        node.textContent = data.ath

        this.aths.appendChild(node)
    }

    renderMcaps(data) {
        let node = utils.createComponent(`
  <div class="v"> </div>
  `)
        node.textContent = data.mcap

        this.mcaps.appendChild(node)
    }

    render(versusData) {
        window.lib.wipeChildren(this.prices)
        window.lib.wipeChildren(this.aths)
        window.lib.wipeChildren(this.mcaps)
        for (let data of versusData) {
            this.renderPrices(data)

            this.renderAths(data)

            this.renderMcaps(data)
        }
    }
}

export class CoinDetails {
    constructor(removeItem, router) {
        this.node = utils.createComponent(`
          <div class="page-container">

          <div class="modal-container">

          </div>

          <div id="coin-details" >




            <div class="details-data-container">

            <div>

            <div class="top-icons">
              <div> </div>
             <div><img class="coin-logo-big"></div>
            <div class="remove-btn-icon"> ${trashcan}</div>
            </div>

            <div id="details-data" >

            <div>Coin:</div>
            <div class="full-name v"></div>

            <label for="add-amount-details"> Amount:</label>
            <input class="add-inp v inp" autocomplete="off" type="number" name="amount" id="add-amount-details"  size=16></input>





            <div class="k">Value:</div> <div class="details-values"></div>

            <div class="k">Portfolio share:</div> <div class="details-shareM v"> </div>





            </div>

            </div>

              <div class="market-data-details-container">

              </div>


              <div class="coin-details-alerts-container">

              </div>


          </div>


            <div class="message" style="color:red; text-align:center;"> </div>

          </div>
          </div>
          `)

        this.name = this.node.querySelector(".full-name")
        this.amountField = this.node.querySelector("input[name=amount]")
        this.icon = this.node.querySelector(".coin-logo-big")
        this.values = this.node.querySelector(".details-values")
        this.share = this.node.querySelector(".details-shareM")

        this.remove = this.node.querySelector(".remove-btn-icon")
        this.message = this.node.querySelector(".message")

        this.marketDataDetails = new MarketDataDetails()

        this.node.querySelector(".market-data-details-container").appendChild(this.marketDataDetails.node)

        this.Alerts = new Alerts(
            this.node.querySelector(".coin-details-alerts-container"),
            this.node.querySelector(".modal-container")
        )

        //component state
        this.currentItem = null

        this.remove.addEventListener("click", () => {
            removeItem(this.currentItem)
            router("")
        })

        this.amountField.addEventListener("change", () => {
            if (this.amountField.value !== "")
                window.EE.emit("changeItemAmount", this.currentItem, this.amountField.value)
        })

        this.amountField.addEventListener("keydown", event => {
            if (event.code === "Enter" || event.key === "Enter") {
                this.amountField.blur()
            }
        })

        this.render = function(itemStrings) {
            router("/CoinDetails")
            this.currentItem = itemStrings.id

            let printableDataVsAll = window.EE.request("printableDataVsAll", itemStrings.id)

            let versusData = printableDataVsAll.versusData

            this.amountField.value = printableDataVsAll.amount
            this.name.textContent = `${printableDataVsAll.name} ${printableDataVsAll.symbol}`

            this.renderIcon(printableDataVsAll.icon)
            this.renderValues(versusData)
            this.renderShare()
            this.marketDataDetails.render(versusData)
            this.Alerts.render(this.currentItem)
        }.bind(this)

        window.EE.on(
            "itemChange",
            function(itemStrings) {
                if (this.currentItem === itemStrings.id) {
                    this.render(itemStrings)
                }
            },
            this
        )
    }

    renderIcon(icon) {
        if (icon) {
            this.icon.src = icon
            this.icon.style.display = "block"
        } else {
            this.icon.style.display = "none"
        }
    }

    renderShare() {
        this.share.textContent = window.EE.request("printableShares")[this.currentItem]
    }

    renderValues(versusData) {
        window.lib.wipeChildren(this.values)
        for (let data of versusData) {
            let node = utils.createComponent(`
  <div class="v"> </div>
  `)
            node.textContent = data.net

            this.values.appendChild(node)
        }
    }

    onUnmount() {
        this.currentItem = null
    }
}
