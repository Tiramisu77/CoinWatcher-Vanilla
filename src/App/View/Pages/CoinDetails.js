import { utils } from "../utils.js"
import "./css/CoinDetails.css"

export class CoinDetails {
    constructor(removeItem, router) {
        this.node = utils.createComponent(`
          <div class="page-container">
          <div id="coin-details" >

            <div><img class="coin-logo-big"></div>

            <div id="details-data" >

              <div>Coin:</div>
              <div class="full-name v">

              </div>

              <label for="add-amount-details"> Amount:</label>
            <input class="add-inp v" autocomplete="off" type="number" name="amount" id="add-amount-details"  size=16></input>



            <div class="k">Price:</div> <div ><div class="details-priceM v"> </div> <div class="details-priceS v"> </div></div>

            <div class="k">Value:</div> <div ><div class="details-valueM v"> </div> <div class="details-valueS v"> </div></div>

            <div class="k">Share of portfolio:</div> <div class="details-shareM v"> </div>

            <div class="k">ATH:</div> <div ><div class="details-athM v"> </div> <div class="details-athS v"> </div> </div>

            <div class="k">Marketcap:</div> <div ><div class="details-mcapM v"> </div> <div class="details-mcapS v"> </div> </div>



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

        this.priceM = this.node.querySelector(".details-priceM")
        this.valueM = this.node.querySelector(".details-valueM")
        this.athM = this.node.querySelector(".details-athM")
        this.mcapM = this.node.querySelector(".details-mcapM")
        this.shareM = this.node.querySelector(".details-shareM")

        this.priceS = this.node.querySelector(".details-priceS")
        this.valueS = this.node.querySelector(".details-valueS")
        this.athS = this.node.querySelector(".details-athS")
        this.mcapS = this.node.querySelector(".details-mcapS")

        //component state
        this.currentItem = null
        this.states = {}

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
