import { utils } from "./utils.js"

import "./css/Spinner.css"
export class Spinner {
    constructor(parent) {
        this.node = utils.createComponent(
            `<div id="floatingBarsG">
	<div class="blockG" id="rotateG_01"></div>
	<div class="blockG" id="rotateG_02"></div>
	<div class="blockG" id="rotateG_03"></div>
	<div class="blockG" id="rotateG_04"></div>
	<div class="blockG" id="rotateG_05"></div>
	<div class="blockG" id="rotateG_06"></div>
	<div class="blockG" id="rotateG_07"></div>
	<div class="blockG" id="rotateG_08"></div>
</div>`,
            parent
        )
    }

    show() {
        this.node.style.display = "block"
    }

    hide() {
        this.node.style.display = "none"
    }
}
