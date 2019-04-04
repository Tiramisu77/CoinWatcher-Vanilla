import { utils } from "../utils.js"
import "./css/CoinDetails.css"

class AddAlert {
    constructor(closeModal) {
        this.node = this.node = utils.createComponent(`
      <div class="add-alert-modal">

      <div>
      Alert type:
      </div>

      <select class="alert-type">
      <option value="price"> Price Target</option>
      <option value="perc"> Percentage Change</option>
      </select>




      <label for="target-alert-inp" class="type-price"> Price:</label>
      <input class="type-price" autocomplete="off" type="number" name="amount" id="target-alert-inp"  size=16></input>


      <label class="type-perc" for="perc-alert-inp"> Percentage change:</label>
      <input class="type-perc" autocomplete="off" type="number" name="amount" id="perc-alert-inp"  size=16></input>

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

            data.id = this.id
            data.currency = this.currencySelect.value
            window.EE.emit("addNotification", data)
            closeModal()
        })

        this.cancel.addEventListener("click", () => {
            closeModal()
        })
    }

    render(id) {
        this.renderCurrencySelects()
        this.alertType.dispatchEvent(new Event("change"))
        this.id = id
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

export class CoinDetails {
    constructor(removeItem, router) {
        this.node = utils.createComponent(`
          <div class="page-container">

          <div class="modal-container">

          </div>

          <div id="coin-details" >

            <div><img class="coin-logo-big"></div>

            <div class="details-data-container">

              <div class="market-data-details">

              <div class="k">Price:</div> <div ><div class="details-priceM v"> </div> <div class="details-priceS v"> </div></div>

              <div class="k">ATH:</div> <div ><div class="details-athM v"> </div> <div class="details-athS v"> </div> </div>

              <div class="k">Marketcap:</div> <div ><div class="details-mcapM v"> </div> <div class="details-mcapS v"> </div> </div>

              </div>

              <div id="details-data" >

              <div>Coin:</div>
              <div class="full-name v"></div>

              <label for="add-amount-details"> Amount:</label>
              <input class="add-inp v" autocomplete="off" type="number" name="amount" id="add-amount-details"  size=16></input>





              <div class="k">Value:</div> <div ><div class="details-valueM v"> </div> <div class="details-valueS v"> </div></div>

              <div class="k">Share:</div> <div class="details-shareM v"> </div>





          </div>

              <div class="coin-details-alerts">

                <div>Price Alerts</div>
                <div class="alert-container"> </div>
                 <div class="add-alert btn">add alert</div>
              </div>


          </div>


            <div class="message" style="color:red; text-align:center;"> </div>
            <div class="remove-container" style="display:flex;justify-content:center;"> <div class="remove-btn btn">remove</div> </div>

          </div>
          </div>
          `)

        this.name = this.node.querySelector(".full-name")
        this.amountField = this.node.querySelector("input[name=amount]")
        this.icon = this.node.querySelector(".coin-logo-big")
        this.removeButton = this.node.querySelector(".remove-btn")
        this.message = this.node.querySelector(".message")
        this.addAlertBtn = this.node.querySelector(".add-alert")

        this.priceM = this.node.querySelector(".details-priceM")
        this.valueM = this.node.querySelector(".details-valueM")
        this.athM = this.node.querySelector(".details-athM")
        this.mcapM = this.node.querySelector(".details-mcapM")
        this.shareM = this.node.querySelector(".details-shareM")

        this.priceS = this.node.querySelector(".details-priceS")
        this.valueS = this.node.querySelector(".details-valueS")
        this.athS = this.node.querySelector(".details-athS")
        this.mcapS = this.node.querySelector(".details-mcapS")

        this.modalContainer = this.node.querySelector(".modal-container")
        this.addAlert = new AddAlert(() => {
            this.modalContainer.innerHTML = ""
            this.modalContainer.style.display = "none"
        })

        //component state
        this.currentItem = null
        this.states = {}

        this.addAlertBtn.addEventListener("click", () => {
            this.modalContainer.innerHTML = ""
            this.modalContainer.appendChild(this.addAlert.node)
            this.modalContainer.style.display = "block"
            this.addAlert.render(this.currentItem)
        })

        const COUNTDOWN_SECONDS = 3

        const countdown = (name, i = COUNTDOWN_SECONDS) => {
            if (i > 0) {
                if (this.currentItem === name) this.removeButton.textContent = `undo (${i})`
                this.states[name].countdownID = setTimeout(countdown, 1000, name, i - 1)
                this.states[name].countdownTick = i
            } else {
                // todo components need to have mount/dismount hooks
                //hack
                if (this.currentItem === name && /CoinDetails/.test(window.location.pathname)) {
                    router("")
                }
                removeItem(name)
                delete this.states[name]
            }
        }

        this.removeButton.addEventListener("click", () => {
            if (this.states[this.currentItem].removeButtonState === "remove") {
                countdown(this.currentItem)
                this.states[this.currentItem].removeButtonState = "undo"
            } else {
                clearTimeout(this.states[this.currentItem].countdownID)
                this.removeButton.textContent = "remove"
                this.states[this.currentItem].removeButtonState = "remove"
                this.states[this.currentItem].countdownTick = null
            }
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
            if (this.states[itemStrings.id] === undefined) {
                this.states[itemStrings.id] = {
                    countdownID: null,
                    removeButtonState: "remove",
                    countdownTick: null,
                }
                this.removeButton.textContent = "remove"
            } else {
                if (this.states[itemStrings.id].removeButtonState === "remove") {
                    this.removeButton.textContent = "remove"
                } else {
                    this.removeButton.textContent =
                        this.states[itemStrings.id].removeButtonState + `(${this.states[itemStrings.id].countdownTick})`
                }
            }

            this.currentItem = itemStrings.id

            this.amountField.value = itemStrings.amount
            this.name.textContent = `${itemStrings.name} ${itemStrings.symbol}`

            this.renderIcon(itemStrings.icon)
            this.renderCoinDetailsApiData(printableCoinApiData, itemStrings)

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
