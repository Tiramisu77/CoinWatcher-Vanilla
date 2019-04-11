import { utils } from "../utils.js"
import "./css/CoinDetails.css"
import { bell, trashcan } from "./icons.js"

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


      <select class="currency-select">
      </select>


      <div class="btn cancel"> cancel </div> <div class="btn ok"> ok </div>
      </div>
      `)
        this.id = null
        this.alertType = this.node.querySelector(".alert-type")
        this.priceInput = this.node.querySelector("input.type-price")
        this.changeInput = this.node.querySelector("input.type-perc")
        this.changePeriod = this.node.querySelector(".period-select")
        this.currencySelect = this.node.querySelector(".currency-select")

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
            data.currency = this.currencySelect.value
            window.EE.emit("addNotification", data)
            rerenderAlerts(this.id)
            closeModal()
        })

        this.cancel.addEventListener("click", () => {
            closeModal()
        })

        this.currencySelect.addEventListener("change", () => {
            this.renderPriceInput(this.currencySelect.value)
        })
    }

    render(id) {
        this.renderCurrencySelects()
        this.alertType.dispatchEvent(new Event("change"))
        this.id = id
        this.renderPriceInput()
        //todo render current price in price input
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
        let currencySelects = this.node.querySelectorAll(".currency-select")
        supportedCurrencies.forEach(currency => {
            currencySelects.forEach(select => {
                let elem = this.createOptionForCurrSelect(currency)
                select.appendChild(elem)
            })
        })

        let currentCurrency = window.EE.request("settings").currentCurrencies.main

        currencySelects.forEach(select => {
            select.querySelector(`[value="${currentCurrency}"]`).selected = true
        })
    }

    createOptionForCurrSelect(option) {
        let elem = document.createElement("option")
        elem.value = option
        elem.textContent = option
        return elem
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
         <div class="add-alert btn" style="justify-self:center; width:80px">add alert</div>
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
        <div class="currency"> </div>
        <div class="remove-X clickable">×</div>
        </div>`
        this.percAlertContainer = this.node.querySelector(".perc-alerts-container")

        this.priceAlertTemplate = `
        <div class="price-alert">
        <div>Price:</div>
        <input class="inp" autocomplete="off" type="number" name="amount"  size=16></input>
        <div class="currency"> </div>
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
        elem.querySelector(".currency").textContent = percAlert.currency
        elem.dataset.coinId = percAlert.coinId
        elem.dataset.notifId = percAlert.notifId
        this.percAlertContainer.appendChild(elem)
    }

    renderPriceAlert(priceAlert) {
        let elem = utils.createComponent(this.priceAlertTemplate)
        elem.querySelector(".currency").textContent = priceAlert.currency
        elem.querySelector("input").value = priceAlert.target
        elem.querySelector("input").addEventListener("change", ev => {
            priceAlert.target = Number(ev.target.value)
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





            <div class="k">Value:</div> <div ><div class="details-valueM v"> </div> <div class="details-valueS v"> </div></div>

            <div class="k">Portfolio share:</div> <div class="details-shareM v"> </div>





            </div>

            </div>

              <div class="market-data-details-container">
              <div class="market-data-details">

              <div class="k">Price:</div> <div class="v"><div class="details-priceM v"> </div> <div class="details-priceS v"> </div></div>

              <div class="k">ATH:</div> <div class="v"><div class="details-athM v"> </div> <div class="details-athS v"> </div> </div>

              <div class="k">Marketcap:</div> <div class="v"><div class="details-mcapM v"> </div> <div class="details-mcapS v"> </div> </div>

              </div>
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

        this.remove = this.node.querySelector(".remove-btn-icon")
        this.message = this.node.querySelector(".message")

        this.priceM = this.node.querySelector(".details-priceM")
        this.valueM = this.node.querySelector(".details-valueM")
        this.athM = this.node.querySelector(".details-athM")
        this.mcapM = this.node.querySelector(".details-mcapM")
        this.shareM = this.node.querySelector(".details-shareM")

        this.priceS = this.node.querySelector(".details-priceS")
        this.valueS = this.node.querySelector(".details-valueS")
        this.athS = this.node.querySelector(".details-athS")
        this.mcapS = this.node.querySelector(".details-mcapS")

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

        this.render = function(itemStrings, printableCoinApiData) {
            this.currentItem = itemStrings.id

            this.amountField.value = itemStrings.amount
            this.name.textContent = `${itemStrings.name} ${itemStrings.symbol}`

            this.renderIcon(itemStrings.icon)
            this.renderCoinDetailsApiData(printableCoinApiData, itemStrings)
            this.Alerts.render(this.currentItem)

            router("/CoinDetails")
        }.bind(this)
    }

    renderIcon(icon) {
        if (icon) {
            this.icon.src = icon
            this.icon.style.display = "block"
        } else {
            this.icon.style.display = "none"
        }
    }

    renderCoinDetailsApiData(printableCoinApiData, itemStrings) {
        let shares = window.EE.request("portfolioStructure")
        let share = shares[this.currentItem].main
        let { netMain, netSecond } = itemStrings
        printableCoinApiData.valueM = netMain
        printableCoinApiData.valueS = netSecond

        for (let key in printableCoinApiData) {
            this[key].textContent = printableCoinApiData[key]
        }
        this.shareM.textContent = share
    }
}
