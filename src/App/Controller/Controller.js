import { Model } from "../Model/Model.js"

import { View } from "../View/View.js"

import { Storage } from "./Storage.js"

import { actions } from "./actions.js"

import { network } from "./network/network.js"

import { MIN_UPDATE_INTERVAL, MAX_SAFE_INTERVAL } from "./constants.js"

import { decorate, tryCatchWrapper } from "../lib.js"

const constants = { MIN_UPDATE_INTERVAL, MAX_SAFE_INTERVAL }

const actionTryCatchWrapper = function(func, args) {
    try {
        return func.call(this, ...args)
    } catch (error) {
        console.error(error)
        return error
    }
}

export class Controller {
    constructor() {
        this.actions = {}

        for (let func in actions) {
            let method = actions[func]
            method = decorate(method, actionTryCatchWrapper)
            method = method.bind(this)
            this.actions[func] = method
        }

        this.network = {}

        for (let func in network) {
            let method = network[func]
            method = decorate(method, tryCatchWrapper)
            method = method.bind(this)
            this.network[func] = method
        }
        this.model = new Model(constants)
        this.view = new View(this.actions)

        this.storage = new Storage(this.model)
        this.timer = null

        this.registerListeners()
    }

    registerListeners() {
        window.EE.on("itemChange", this.actions.onItemChange)
        window.addEventListener("load", this.onLaunch.bind(this))
    }

    async onLaunch() {
        try {
            this.storage.onLaunch()

            this.view.onLaunch(this.model.itemStringsList, this.model.total, this.model.settings)

            await this.network.getSupportedCoinsAndCurrencies()

            this.network.loop()

            //this.actions.getNotifPermission()

            window.addEventListener("focus", () => {
                this.network.loop()
                console.warn("starting sync loop")
            })
            /*
            window.addEventListener("blur", () => {
                clearTimeout(this.timer)
                console.warn("exiting sync loop")
            })*/
        } catch (error) {
            console.error(error)
        }
    }
}
