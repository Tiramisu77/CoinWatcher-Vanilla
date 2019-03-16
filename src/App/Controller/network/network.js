import { MIN_UPDATE_INTERVAL, MAX_SAFE_INTERVAL } from "../constants.js"
import { decorate } from "../../lib.js"
import { loadFromCoinmarketcap } from "./APIs/coinmarketcap.js"
import { loadFromCoingecko, loadFromCoingeckoSingle, loadSupportedCoinsCoingecko } from "./APIs/coingecko.js"
import {
    loadFromAlternativeMe,
    loadFromAlternativemeSingle,
    loadSupportedCoinsAlternativeme,
} from "./APIs/alternativeme.js"

import { asyncShorCircuit } from "./loaderHelpers.js"

const spinnerWrapper = async function(func, args) {
    try {
        this.view.showSpinner()
        return await func.call(this, ...args)
    } finally {
        this.view.hideSpinner()
    }
}

const apiNamesToFuncs = function(apiNamesArr) {
    const apiNameMap = {
        coinmarketcap: loadFromCoinmarketcap,
        coingecko: loadFromCoingecko,
        alternativeme: loadFromAlternativeMe,
    }
    return apiNamesArr.map(name => apiNameMap[name])
}

const getMarketData = async function() {
    const prices = await asyncShorCircuit(apiNamesToFuncs(this.model.settings.apiList))
    this.model.marketData = prices
}

const apiNamesToFuncsSingle = function(apiNamesArr, ids) {
    const apiNameMap = {
        coingecko: loadFromCoingeckoSingle,
        alternativeme: loadFromAlternativemeSingle,
        coinmarketcap: () => {
            return Promise.reject("placeholder")
        },
    }

    const res = apiNamesArr.reduce((acc, name) => {
        if (ids[name]) {
            acc.push(apiNameMap[name].bind(null, ids[name]))
        }
        return acc
    }, [])

    return res
}

const getMarketDataSingle = async function(ids, apiList) {
    const data = await asyncShorCircuit(apiNamesToFuncsSingle(apiList, ids))
    return data
}

const loadPircesAndUpdate = decorate(async function() {
    try {
        if (this.model.settings.networkMode === "batch") {
            await getMarketData.call(this)
            this.model.updatePortfolio()
            this.view.sortPortfolio(this.model.sortedPortfolioNames)
            this.view.renderTotal(this.model.total)
            this.view.clearErrorMessage("Unable to load market data")
        } else if (this.model.settings.networkMode === "single") {
            const res = await Promise.all(
                this.model.sortedPortfolioNames.map(e => _loadPircesAndUpdateSingle.call(this, e))
            )

            if (res.length > 0 && res.every(e => e === "not ok")) {
                throw "Failed to load prices in single mode"
            }
            this.view.clearErrorMessage("Unable to load market data")
        }
    } catch (e) {
        this.view.renderHeadMessage({ body: "Unable to load market data", type: "error" })
        throw e
    }
}, spinnerWrapper)

const _loadPircesAndUpdateSingle = async function(ticker) {
    try {
        const ids = this.model.getCoinIds(ticker)
        if (ids === null) return false

        const data = await getMarketDataSingle(ids, this.model.settings.apiList)

        this.model.marketData = { ...this.model.marketData, [ticker]: data }
        this.model.updateItem(ticker)
        this.view.sortPortfolio(this.model.sortedPortfolioNames)
        this.view.renderTotal(this.model.total)

        return "ok"
    } catch (e) {
        if (window.DEBUG) console.error(e)

        return "not ok"
    }
}

const loadPircesAndUpdateSingle = decorate(async function(ticker) {
    try {
        let res = await _loadPircesAndUpdateSingle.call(this, ticker)
        if (res === "not ok") throw `failed to load ${ticker}`
        this.view.clearErrorMessage(`Unable to load market data for ${ticker}`)
    } catch (e) {
        if (window.DEBUG) console.error(e)

        this.view.renderHeadMessage({ body: `Unable to load market data for ${ticker}`, type: "error" })
        throw e
    }
}, spinnerWrapper)

const loadSupportedCoinsFromApi = decorate(async function() {
    try {
        let res = await Promise.all([loadSupportedCoinsCoingecko(), loadSupportedCoinsAlternativeme()])
        if (res.length > 0 && res.every(e => e === "not ok")) {
            throw new Error("failed to load supported coins")
        }
        res = res.reduce((acc, e) => {
            if (e === "not ok") return acc
            acc = { ...acc, ...e }
            return acc
        }, {})

        for (let api in res) {
            this.model.SupportedCoins[api] = res[api]
        }

        this.storage.saveCoinList()
    } catch (e) {
        if (window.DEBUG) console.warn(e)
        this.model.settings.networkMode = "batch" //todo investigate, this might cause bugs
        setTimeout(this.getSupportedCoins, 1000 * 60)
    }
}, spinnerWrapper)

const getSupportedCoins = async function() {
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
    getSupportedCoins,
}
