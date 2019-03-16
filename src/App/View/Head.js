import { utils } from "./utils.js"

import { Spinner } from "./Spinner.js"

export class Head {
    constructor(parent) {
        this.node = utils.createComponent(
            `
          <div id="apphead" style="display: grid;
            grid-template-columns: 60px 1fr 60px;">
            <div id="head-left">
            </div>
            <div id="head-center" style="justify-self:center;">
            <span id="head-message">
            </span>&nbsp&nbsp
            <span id="hide-message-btn" style="visibility:hidden">╳</span>

            </div>
            <div id="head-right">

            </div>
          </div>`,
            parent
        )

        this.Spinner = new Spinner(this.node.querySelector("#head-left"))
        this.headMessage = this.node.querySelector("#head-message")
        this.hideMessageButton = this.node.querySelector("#hide-message-btn")

        this.hideMessageButton.addEventListener("click", () => {
            this.wipeHeadMessage()
        })
    }

    showSpinner() {
        this.Spinner.show()
    }

    hideSpinner() {
        this.Spinner.hide()
    }

    renderHeadMessage(msg) {
        this.headMessage.style.color = msg.type === "error" ? "red" : "var(--main-font-color)"
        this.headMessage.textContent = msg.body
        this.hideMessageButton.style.visibility = "visible"
    }

    wipeHeadMessage() {
        this.headMessage.textContent = ""
        this.hideMessageButton.style.visibility = "hidden"
    }

    clearErrorMessage(msg) {
        if (this.headMessage.textContent === msg) {
            this.wipeHeadMessage()
        }
    }
}
