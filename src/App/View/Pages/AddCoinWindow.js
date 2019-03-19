import "./css/AddCoinWindow.css"

import { Autocomplete } from "./Autocomplete.js"

export class AddCoinWindow {
    constructor(addItem, router, getAutocompleteList, getNameFromId) {
        this.node = document.createElement("div")
        this.node.id = "AddCoinWindow"
        this.node.innerHTML = `
        <form id="add-coin-form">
          <div style="display:flex;justify-content: space-between;margin-top:4px;"><span>Name:</span> <span class="full-name"></span>
          </div>

          <div class="input-container" >
          <label for="add-symbol"> Symbol:</label>
          <div style="position:relative">
          <input class="add-inp" type="text" name="symbol" id="add-symbol" minlength=1 autocomplete="off" maxlength=8 />

          </div>
          </div>

          <div class="input-container" >
          <label for="add-amount"> Amount:</label> <input class="add-inp" autocomplete="off" type="number" name="amount" id="add-amount"  size=16 />
          </div>
          <div class="message" style="color:red; text-align:center;"> </div>
          <div class="confirm-add-container"> <div class="confirm-add btn"> ADD </div> </div>
       </form>`

        this.getNameFromId = getNameFromId

        this.confirm = this.node.querySelector(".confirm-add")
        this.tickerField = this.node.querySelector("input[name=symbol]")
        this.fullName = this.node.querySelector(".full-name")
        this.amountField = this.node.querySelector("input[name=amount]")
        this.message = this.node.querySelector(".message")

        this.autocompleteItemHandler = this.autocompleteItemHandler.bind(this)
        this.autocompleteField = new Autocomplete(this.autocompleteItemHandler, this.tickerField.parentNode)

        this.addListeners(addItem, router, getAutocompleteList, getNameFromId)
    }

    addListeners(addItem, router, getAutocompleteList, getNameFromId) {
        this.tickerField.addEventListener("blur", () => {
            this.renderAutocomplete([])
            //bugfix
            // this fixes the race condition when this element loses focus before autocomplete was rendered
            clearTimeout(timer)
        })

        this.tickerField.addEventListener("keydown", event => {
            if (event.code === "Enter" || event.key === "Enter") {
                if (this.amountField.value === "" && this.tickerField.value !== "") {
                    this.amountField.focus()
                } else {
                    this.confirm.click()
                }
            }
        })

        //timer for throttling autocomplete
        let timer = null

        this.tickerField.addEventListener("input", () => {
            this.tickerField.value = this.tickerField.value.toUpperCase()

            /*todo
             *this is a hack for preventing uppercasing coins with 0x in their name
             *this requires some investigation because there might be similar cases
             */
            if (/^0X/.test(this.tickerField.value)) {
                let a = this.tickerField.value.split("")
                a[1] = "x"
                this.tickerField.value = a.join("")
            }
            this.message.textContent = ""
            this.fullName.textContent = this.tickerField.value === "" ? "" : getNameFromId(this.tickerField.value)

            clearTimeout(timer)
            timer = setTimeout(() => {
                const list = getAutocompleteList(this.tickerField.value)
                this.renderAutocomplete(list)
            }, 350)
        })

        this.amountField.addEventListener("input", () => {
            this.message.textContent = ""
        })
        this.amountField.addEventListener("keydown", event => {
            if (event.code === "Enter" || event.key === "Enter") {
                this.confirm.click()
            }
        })

        this.confirm.addEventListener("click", () => {
            if (this.tickerField.value === "") {
                this.tickerField.focus()
                return
            }
            if (this.amountField.value === "") {
                this.amountField.focus()
                return
            }
            let res = addItem(this.tickerField.value, this.amountField.value)

            if (res === "ok") {
                router("")
                this.message.textContent = ""
                this.amountField.value = ""
                this.tickerField.value = ""
                this.fullName.textContent = ""
            } else {
                this.message.textContent = res
            }
        })
    }

    renderAutocomplete(list) {
        this.autocompleteField.renderList(list)
    }

    autocompleteItemHandler(event) {
        this.tickerField.value = event.target.innerText
        this.fullName.textContent = this.getNameFromId(event.target.innerText)
    }
}
