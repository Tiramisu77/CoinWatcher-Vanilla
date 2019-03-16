import { utils } from "../utils.js"

export class ChangePeriodButtons {
    constructor(switchPriceChangePeriod, parent) {
        this.node = utils.createComponent(
            `
          <div id="change-period-buttons">
          <div  id="one-hour">1 hour</div>
          <div  id="twenty-four-hours">24 hours</div>
          <div  id="seven-days">7 days</div>
          </div>
          `,
            parent
        )

        this["1h"] = this.node.querySelector("#one-hour")
        this["24h"] = this.node.querySelector("#twenty-four-hours")
        this["7d"] = this.node.querySelector("#seven-days")
        this["1h"].addEventListener("click", event => {
            switchPriceChangePeriod("1h")
            event.target.classList.add("period-btn-pressed")
            this["24h"].classList.remove("period-btn-pressed")
            this["7d"].classList.remove("period-btn-pressed")
        })
        this["24h"].addEventListener("click", event => {
            switchPriceChangePeriod("24h")
            event.target.classList.add("period-btn-pressed")
            this["1h"].classList.remove("period-btn-pressed")
            this["7d"].classList.remove("period-btn-pressed")
        })
        this["7d"].addEventListener("click", event => {
            switchPriceChangePeriod("7d")
            event.target.classList.add("period-btn-pressed")
            this["24h"].classList.remove("period-btn-pressed")
            this["1h"].classList.remove("period-btn-pressed")
        })
    }

    renderInit(changePeriod) {
        this[changePeriod].classList.add("period-btn-pressed")
    }
}
