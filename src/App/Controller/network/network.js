import { MIN_UPDATE_INTERVAL, MAX_SAFE_INTERVAL } from "../constants.js"
import { decorate } from "../../lib.js"

import {
    loadFromCoingeckoSingle,
    loadSupportedCoinsCoingecko,
    loadVersusCurrenciesCoingecko,
} from "./APIs/coingecko.js"

//import { asyncShorCircuit } from "./loaderHelpers.js"

const spinnerWrapper = async function(func, args) {
    try {
        this.view.showSpinner()
        return await func.call(this, ...args)
    } finally {
        this.view.hideSpinner()
    }
}

const loadPircesAndUpdate = decorate(async function() {
    try {
        const res = await Promise.all(
            this.model.sortedPortfolioNames.map(e => _loadPircesAndUpdateSingle.call(this, e))
        )

        if (res.length > 0 && res.every(e => e === "not ok")) {
            throw "Failed to load prices in single mode"
        }

        this.view.clearErrorMessage("Unable to load market data")
    } catch (e) {
        this.view.renderHeadMessage({ body: "Unable to load market data", type: "error" })
        throw e
    }
}, spinnerWrapper)

//this gets called either when user adds a coin, or when portfolio updates
const _loadPircesAndUpdateSingle = async function(id) {
    try {
        if (this.model.SupportedCoins.isInList(id) === false) return "ok"
        const data = await loadFromCoingeckoSingle(id)

        this.model.marketData = { ...this.model.marketData, [id]: data }
        this.model.updateItem(id)
        this.view.sortPortfolio(this.model.sortedPortfolioNames)
        this.view.renderTotal(this.model.total)

        return "ok"
    } catch (e) {
        if (window.DEBUG) console.error(e)

        return "not ok"
    }
}

// this function is called when user adds new item to portfolio
const loadPircesAndUpdateSingle = decorate(async function(id) {
    try {
        let res = await _loadPircesAndUpdateSingle.call(this, id)
        if (res === "not ok") throw `failed to load ${id}`
        this.view.clearErrorMessage(`Unable to load market data for ${id}`)
    } catch (e) {
        if (window.DEBUG) console.error(e)

        this.view.renderHeadMessage({ body: `Unable to load market data for ${id}`, type: "error" })
        throw e
    }
}, spinnerWrapper)

const LOAD_SUPPORTED_COINS_RETRY = 1000 * 30 //seconds
const loadSupportedCoinsFromApi = decorate(async function() {
    try {
        let res = await loadSupportedCoinsCoingecko()

        this.model.SupportedCoins.initizalizeList(res)

        this.storage.saveCoinList(res)
    } catch (e) {
        if (window.DEBUG) console.warn(e)
        setTimeout(this.getSupportedCoins, LOAD_SUPPORTED_COINS_RETRY)
    }
}, spinnerWrapper)

const loadVersusCurrencies = async function() {
    loadVersusCurrenciesCoingecko()
        .then(r => r.map(e => e.toUpperCase()))
        .then(r => r.sort((a, b) => a.localeCompare(b)))
        .then(r => {
            this.model.versusCurrencies = r
        })
        .then(() => {
            this.view.addAllCurrencyOptions(this.model.versusCurrencies, this.model.settings)
        })
        .catch(console.error)
}

const getSupportedCoinsAndCurrencies = async function() {
    loadVersusCurrencies.call(this)

    let res = this.storage.loadCoinList()

    if (res === "needs update") {
        await loadSupportedCoinsFromApi.call(this)
    }
    if (res === "will need update soon") {
        setTimeout(this.loadSupportedCoins, 1000 * 60 * 2) //magic
    }
}

const loop = async function() {
    let interval = this.model.settings.updateInterval
    if (
        typeof interval !== "number" ||
        isNaN(interval) ||
        interval < MIN_UPDATE_INTERVAL ||
        interval > MAX_SAFE_INTERVAL
    ) {
        throw new Error("bad interval")
    }
    await loadPircesAndUpdate.call(this)
    this.timer = setTimeout(this.network.loop, interval)
}

export const network = {
    loop,
    loadPircesAndUpdateSingle,
    getSupportedCoinsAndCurrencies,
}
