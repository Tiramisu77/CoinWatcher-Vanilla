import { utils } from "../utils.js"
export class TotalValue {
    constructor() {
        this.node = utils.createComponent(`
          <div id="networth">
          </div>`)
    }

    render(printableTotalValue) {
        window.lib.wipeChildren(this.node)
        for (let item of printableTotalValue) {
            this.renderItem(item)
        }
    }

    renderItem(item) {
        let node = utils.createComponent(`
        <div>

        <div  class="total-val">
        </div>
        <div>
        <span  class="net-changes change-perc">
        </span>
        <span  class="net-changes">
        /
        </span>
        <span class="net-changes change-abs">
        </span>
        </div>

        </div>
`)

        let totalVal = node.querySelector(".total-val")
        let changePerc = node.querySelector(".change-perc")
        let changeAbs = node.querySelector(".change-abs")

        totalVal.textContent = item.totalValue
        changePerc.textContent = item.changePerc.str
        changeAbs.textContent = item.changeAbs.str

        changePerc.style.color = item.changePerc.color
        changeAbs.style.color = item.changeAbs.color

        this.node.appendChild(node)
    }
}
