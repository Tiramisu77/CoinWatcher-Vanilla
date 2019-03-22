import { utils } from "../utils.js"

const AUTOCOMPLETE_SLOTS = 200

const INITIALIZATION_DELAY = 1500 //miliseconds

export class Autocomplete {
    constructor(autocompleteItemHandler, parent) {
        this.node = utils.createComponent(
            `
      <div class="ticker-autocomplete"></div>
      `,
            parent
        )

        this.autocompleteSlots = []
        setTimeout(() => {
            for (let i = 0; i < AUTOCOMPLETE_SLOTS; i++) {
                let elem = utils.createComponent(`<div class="autocomplete-item"></div>`)
                elem.addEventListener("mousedown", autocompleteItemHandler)
                this.node.appendChild(elem)
                this.autocompleteSlots.push(elem)
            }
        }, INITIALIZATION_DELAY)
    }
    renderList(list) {
        list = list.forEach ? list : [] // coerce into array, maybe this should throw on non-arrays

        list = list.slice(0, this.autocompleteSlots.length)

        //wipe old texts starting with list length offset, because previous items will be rewritten anyway
        for (let i = list.length; i < this.autocompleteSlots.length; i++) {
            this.autocompleteSlots[i].style.display = "none"
        }
        //render new texts
        for (let i = 0; i < list.length; i++) {
            this.autocompleteSlots[i].textContent = list[i]
            this.autocompleteSlots[i].style.display = "block"
        }
    }
}
