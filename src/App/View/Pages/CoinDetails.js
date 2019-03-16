import { utils } from "../utils.js"
import "./css/CoinDetails.css"

export class CoinDetails {
    constructor(editItem, removeItem, router) {
        this.node = utils.createComponent(`
          <div id="coin-details">

          <img class="coin-logo">
          <div style="display:flex;justify-content: space-between;margin-top:4px;"><span>Coin:</span> <span><span class="full-name"></span>&nbsp;<span class="ticker"></span></span>
          </div>

        <div class="input-container" >
        <label for="add-amount-details"> Amount:</label> <input class="add-inp" autocomplete="off" type="number" name="amount" id="add-amount-details"  size=16 />
          </div>
          <div class="message" style="color:red; text-align:center;"> </div>

           <div class="remove-container" style="display:flex;justify-content:center;"> <div class="remove-btn btn">remove</div> </div>

          </div>
          `)

        this.name = this.node.querySelector(".ticker")
        this.fullName = this.node.querySelector(".full-name")
        this.amountField = this.node.querySelector("input[name=amount]")
        this.icon = this.node.querySelector(".coin-logo")
        this.removeButton = this.node.querySelector(".remove-btn")
        this.message = this.node.querySelector(".message")
        this.currentItem = null

        this.states = {}

        const countdown = (name, i = 5) => {
            if (i > 0) {
                if (this.currentItem === name) this.removeButton.textContent = `undo (${i})`
                this.states[name].countdownID = setTimeout(countdown, 1000, name, i - 1)
                this.states[name].countdownTick = i
            } else {
                if (this.currentItem === name) router("")
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
            editItem(this.name.textContent, this.amountField.value)
        })

        this.amountField.addEventListener("keydown", event => {
            if (event.code === "Enter") {
                this.amountField.blur()
            }
        })

        this.render = function(itemStrings) {
            if (this.states[itemStrings.name] === undefined) {
                this.states[itemStrings.name] = {
                    countdownID: null,
                    removeButtonState: "remove",
                    countdownTick: null,
                }
                this.removeButton.textContent = "remove"
            } else {
                if (this.states[itemStrings.name].removeButtonState === "remove") {
                    this.removeButton.textContent = "remove"
                } else {
                    this.removeButton.textContent =
                        this.states[itemStrings.name].removeButtonState +
                        `(${this.states[itemStrings.name].countdownTick})`
                }
            }

            this.currentItem = itemStrings.name
            this.name.textContent = itemStrings.name
            this.amountField.value = itemStrings.amount
            this.fullName.textContent = itemStrings.fullName
            if (itemStrings.icon) {
                this.icon.src = itemStrings.icon
                this.icon.style.display = "block"
            } else {
                this.icon.style.display = "none"
            }
            router("/CoinDetails")
        }.bind(this)
    }
}
