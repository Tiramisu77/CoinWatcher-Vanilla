import { utils } from "../utils.js"
import "./css/AppSettings.css"

export class AppSettings {
    constructor(changeSettings, aboutRoute) {
        this.node = utils.createNode({
            tag: "div",
            innerHTML: `
            <div>
            <div class="settings-item">
              <span id="about-btn">About</span>

            </div>
            <div class="settings-item">
              <span>Sync interval:</span>&nbsp
              <select id="update-interval-select" >
                <option value="2 min">2 min</option>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>



            <div class="settings-item">
              <span>Primary currency: </span>&nbsp
              <select id="prim-currency-select" >


              </select>
            </div>

            <div class="settings-item">
              <span>Secondary currency: </span>&nbsp
              <select id="sec-currency-select" >


              </select>
            </div>

            <div class="settings-item">
              <span>Color scheme: </span>&nbsp
              <select id="color-scheme-select" >
                <option value="default">Default</option>
                <option value="custom">Custom</option>
              </select>
            </div>



            <div class="color-scheme-picker">
            <span>Primary color: </span> <input type="color" id="primary-color" class="color-picker"> </input>
            <span>Secondary color: </span> <input type="color" id="secondary-color" class="color-picker"> </input>
            <span>Site background: </span> <input type="color" id="global-bg" class="color-picker"> </input>
            <span>Text color: </span> <input type="color" id="text-color" class="color-picker"> </input>
            </div>

            <div class="message"> </div>
            </div>
          `,
        })

        this.aboutBtn = this.node.querySelector("#about-btn")

        this.updateIntervalSelect = this.node.querySelector("#update-interval-select")

        this.primaryCurrencySelect = this.node.querySelector("#prim-currency-select")
        this.secondaryCurrencySelect = this.node.querySelector("#sec-currency-select")

        this.colorSchemeSelect = this.node.querySelector("#color-scheme-select")
        this.colorSchemePicker = this.node.querySelector(".color-scheme-picker")
        this.primaryColor = this.node.querySelector("#primary-color")
        this.secondaryColor = this.node.querySelector("#secondary-color")
        this.globalBgColor = this.node.querySelector("#global-bg")
        this.textColor = this.node.querySelector("#text-color")

        this.message = this.node.querySelector(".message")

        this.aboutBtn.addEventListener("click", () => {
            aboutRoute()
        })

        this.updateIntervalSelect.addEventListener("change", () => {
            changeSettings("interval", this.updateIntervalSelect.value)
        })

        this.primaryCurrencySelect.addEventListener("change", () => {
            changeSettings("currencyMain", this.primaryCurrencySelect.value)
        })

        this.secondaryCurrencySelect.addEventListener("change", () => {
            changeSettings("currencySecond", this.secondaryCurrencySelect.value)
        })

        this.colorSchemeSelect.addEventListener("change", () => {
            if (this.colorSchemeSelect.value === "default") {
                changeSettings("colorScheme", this.colorSchemeSelect.value)
                this.colorSchemePicker.style.display = "none"
            } else {
                this.colorSchemePicker.style.display = "grid"
                changeSettings("colorScheme", this.currentCustomScheme)
            }
        })

        this.node.querySelectorAll(".color-picker").forEach(element => {
            element.addEventListener("change", () => {
                changeSettings("colorScheme", this.currentCustomScheme)
            })
        })
    }

    get currentCustomScheme() {
        return {
            "--main-color": this.primaryColor.value,
            "---secondary-color": this.secondaryColor.value,
            "--page-bg-color": this.globalBgColor.value,
            "--main-font-color": this.textColor.value,
        }
    }

    render(settings) {
        try {
            this.updateIntervalSelect.querySelector(
                `[value="${settings.updateInterval / (1000 * 60)} min"]`
            ).selected = true

            this.primaryColor.value = settings.colorScheme.custom["--main-color"]
            this.secondaryColor.value = settings.colorScheme.custom["---secondary-color"]
            this.textColor.value = settings.colorScheme.custom["--main-font-color"]
            this.globalBgColor.value = settings.colorScheme.custom["--page-bg-color"]

            if (settings.colorScheme.current === "custom") {
                this.colorSchemeSelect.value = "custom"
                this.colorSchemePicker.style.display = "grid"
            }
        } catch (e) {
            if (window.DEBUG) console.error(e)
        }
    }

    createOptionForCurrSelect(option) {
        let elem = document.createElement("option")
        elem.value = option
        elem.textContent = option
        return elem
    }

    addCurrOptionToBoth(option) {
        let elem = this.createOptionForCurrSelect(option)
        let clone = this.createOptionForCurrSelect(option)
        this.primaryCurrencySelect.appendChild(elem)
        this.secondaryCurrencySelect.appendChild(clone)
    }

    addAllCurrencyOptions(list, settings) {
        for (let item of list) {
            this.addCurrOptionToBoth(item)
        }
        this.primaryCurrencySelect.querySelector(`[value="${settings.currentCurrencies.main}"]`).selected = true
        this.secondaryCurrencySelect.querySelector(`[value="${settings.currentCurrencies.second}"]`).selected = true
    }
}
