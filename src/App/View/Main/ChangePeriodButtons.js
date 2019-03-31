import { utils } from "../utils.js"

export class ChangePeriodButtons {
    constructor(switchPriceChangePeriod, parent) {
        this.node = utils.createComponent(
            `
          <div id="change-period-buttons">
          <div>
          <div class="change-period-btn" data-option="1h">1 hour</div>
          <div class="change-period-btn" data-option="24h">24 hours</div>
          <div class="change-period-btn" data-option="7d">7 days</div>
          </div>
          <div>
          <div class="change-period-btn" data-option="30d">30 days</div>
          <div class="change-period-btn" data-option="60d">60 days</div>
          <div class="change-period-btn" data-option="200d">200 days</div>
          </div>
          </div>

          `,
            parent
        )
        this.switchPriceChangePeriod = switchPriceChangePeriod
        this.currentPressed = this.node.querySelector(".change-period-btn")

        this.node
            .querySelectorAll(".change-period-btn")
            .forEach(btn => btn.addEventListener("click", this.clickHandler.bind(this)))
    }

    renderInit(changePeriod) {
        this.node.querySelectorAll(".change-period-btn").forEach(e => {
            if (e.dataset.option === changePeriod) {
                e.dispatchEvent(new Event("click"))
            }
        })
    }

    clickHandler(event) {
        if (!event.target.dataset) return
        this.switchPriceChangePeriod(event.target.dataset.option)
        this.currentPressed.classList.remove("period-btn-pressed")
        event.target.classList.add("period-btn-pressed")

        this.currentPressed = event.target
    }
}
