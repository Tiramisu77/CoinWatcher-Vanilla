import { utils } from "../utils.js"
import "./css/AppSettings.css"

class VersusCurrItem {
    constructor(name) {
        this.node = utils.createComponent(`
          <div>
          <span class="versus-curr-name">${name}</span>
          <span class="remove-versus-curr">x</span>
          </div>`)
        this.node.querySelector(".remove-versus-curr").addEventListener("click", () => {
            let res = window.EE.request(
                "removeVersusCurrency",
                this.node.querySelector(".versus-curr-name").textContent
            )
            if (res) this.node.parentNode.removeChild(this.node)
        })
    }
}

class CustomSelect {
    constructor(adder) {
        this.node = utils.createComponent(`
      <div class="custom-select">

      </div>`)

        this.node.style.display = "none"
        document.addEventListener("click", e => {
            if (e.data !== "dont_hide") this.node.style.display = "none"
        })
        this.node.addEventListener("click", e => {
            adder(e.target.dataset.value)
            window.EE.emit("addVersusCurrency", e.target.dataset.value)
            this.node.style.display = "none"
        })
    }

    addOptions() {
        let list = window.EE.request("supportedVersusCurrencies")
        let settings = window.EE.request("settings")
        let alreadyAdded = new Set(settings.versusCurrencies)
        for (let item of list) {
            if (alreadyAdded.has(item) === false) {
                this.add(item)
            }
        }
    }

    add(option) {
        let e = document.createElement("div")
        e.textContent = option
        e.dataset.value = option
        e.style.cursor = "default"
        this.node.appendChild(e)
    }

    render() {
        this.node.style.display = "block"
        window.lib.wipeChildren(this.node)
        this.addOptions()
    }
}

class VersusCurrencyManager {
    constructor() {
        this.node = utils.createComponent(`
      <div class="settings-item">
        <span>Versus currencies: </span><span class="setting-item-padder"> </span>
        <div id="versus-currencies" >
        <div id="add-versus-currency" class="btn">
        ADD
        </div>

        </div>
      </div>`)
        this.versusCurrencies = this.node.querySelector("#versus-currencies")
        this.currencySelect = new CustomSelect(this.addVersusCurrency.bind(this))

        this.node.querySelector("#add-versus-currency").addEventListener("click", e => {
            this.currencySelect.render()
            e.data = "dont_hide"
        })
        this.node.querySelector("#versus-currencies").appendChild(this.currencySelect.node)
    }
    addOptions(list, settings) {
        this.currencySelect.addOptions(list, settings)
    }

    addVersusCurrency(currency) {
        let versusCurrItem = new VersusCurrItem(currency)
        this.versusCurrencies.appendChild(versusCurrItem.node)
    }
    render(settings) {
        let { versusCurrencies } = settings
        for (let currency of versusCurrencies) {
            this.addVersusCurrency(currency)
        }
    }
}

export class AppSettings {
    constructor(changeSettings, aboutRoute) {
        this.node = utils.createComponent(
            `
            <div class="page-container">
            <div id="AppSettings" >
            <div class="settings-item">
              <span id="about-btn" class="clickable">About</span>

            </div>
            <div class="settings-item">
              <span>Sync interval:</span><span class="setting-item-padder"> </span>
              <select id="update-interval-select" >
                <option value="2 min">2 min</option>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>





            <div class="settings-item" id="color-scheme">
              <span>Color scheme: </span><span class="setting-item-padder"> </span>
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
            </div>
          `
        )

        this.aboutBtn = this.node.querySelector("#about-btn")

        this.updateIntervalSelect = this.node.querySelector("#update-interval-select")

        this.versusCurrencies = new VersusCurrencyManager()

        this.node
            .querySelector("#AppSettings")
            .insertBefore(this.versusCurrencies.node, this.node.querySelector("#color-scheme"))

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

            this.versusCurrencies.render(settings)

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

    addAllCurrencyOptions(list, settings) {
        this.versusCurrencies.addOptions(list, settings)
    }
}
