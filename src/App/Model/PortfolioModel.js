import { ItemModel } from "./ItemModel.js"
import { numToFormattedString } from "./helpers.js"
export class PortfolioModel {
    constructor(itemObserver, settings) {
        this.itemObserver = itemObserver
        this.settings = settings
        this.marketData = {}
        this.items = {}

        Object.preventExtensions(this)
    }
    get bitcoinData() {
        return this.marketData.BTC
            ? {
                  "24h": parseFloat(this.marketData.BTC.percent_change_24h),
                  "1h": parseFloat(this.marketData.BTC.percent_change_1h),
                  "7d": parseFloat(this.marketData.BTC.percent_change_7d),
              }
            : {
                  "24h": null,
                  "1h": null,
                  "7d": null,
              }
    }

    getnumericalTotalValue(timePeriod, mainCurrency, secondCurrency) {
        const total = { mainCurrencyNet: 0, mainCurrencyChangeAbs: 0, secondCurrencyNet: 0, secondCurrencyChangeAbs: 0 }

        for (let item in this.items) {
            let numData = this.items[item].getNumericalDataAgainstCurrencies(timePeriod, mainCurrency, secondCurrency)
            let { netMain, changeMainAbs, netSecond, changeSecondAbs } = numData

            total.mainCurrencyNet += netMain
            total.mainCurrencyChangeAbs += changeMainAbs
            total.secondCurrencyNet += netSecond
            total.secondCurrencyChangeAbs += changeSecondAbs
        }

        const mainChangePerc =
            (total.mainCurrencyChangeAbs * 100) / (total.mainCurrencyNet + total.mainCurrencyChangeAbs) || 0
        const secondChangePerc =
            (total.secondCurrencyChangeAbs * 100) / (total.secondCurrencyNet + total.secondCurrencyChangeAbs) || 0
        return { ...total, mainChangePerc, secondChangePerc }
    }

    getPrintableTotalAgainstCurrencies(timeperiod, mainCurrency, secondCurrency) {
        let numData = this.getnumericalTotalValue(timeperiod, mainCurrency, secondCurrency)
        let {
            mainCurrencyNet,
            mainCurrencyChangeAbs,
            secondCurrencyNet,
            secondCurrencyChangeAbs,
            mainChangePerc,
            secondChangePerc,
        } = numData
        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"

        mainCurrencyNet = numToFormattedString(mainCurrencyNet, { type: "currency", currency: mainCurrency, lang })
        mainCurrencyChangeAbs = numToFormattedString(mainCurrencyChangeAbs, {
            type: "currency",
            currency: mainCurrency,
            isChange: true,
            lang,
        })
        mainChangePerc = numToFormattedString(mainChangePerc, { type: "percentage", isChange: true })

        secondCurrencyNet = numToFormattedString(secondCurrencyNet, {
            type: "currency",
            currency: secondCurrency,
            lang,
        })
        secondCurrencyChangeAbs = numToFormattedString(secondCurrencyChangeAbs, {
            type: "currency",
            currency: secondCurrency,
            lang,
            isChange: true,
        })
        secondChangePerc = numToFormattedString(secondChangePerc, { type: "percentage", isChange: true })

        return {
            mainCurrencyNet,
            mainCurrencyChangeAbs,
            secondCurrencyNet,
            secondCurrencyChangeAbs,
            mainChangePerc,
            secondChangePerc,
        }
    }

    get printableTotalValue() {
        return this.getPrintableTotalAgainstCurrencies(
            this.settings.priceChangePeriod,
            this.settings.currentCurrencies.main,
            this.settings.currentCurrencies.second
        )
    }

    get mcapAsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let cap1 = this.items[elem1].mcapUSD
            let cap2 = this.items[elem2].mcapUSD
            return cap1 - cap2
        })
    }
    get mcapDsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let cap1 = this.items[elem1].mcapUSD
            let cap2 = this.items[elem2].mcapUSD
            return cap2 - cap1
        })
    }
    get alphaAsc() {
        return Object.keys(this.items).sort((a, b) => {
            return a.localeCompare(b)
        })
    }
    get alphaDsc() {
        return Object.keys(this.items).sort((a, b) => {
            return b.localeCompare(a)
        })
    }
    get netvalAsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let val1 = this.items[elem1].netValue
            let val2 = this.items[elem2].netValue
            return val1 - val2
        })
    }
    get netvalDsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let val1 = this.items[elem1].netValue
            let val2 = this.items[elem2].netValue
            return val2 - val1
        })
    }

    getSortedPortfolioNames(ordering) {
        return this[ordering]
    }

    //todo check if this is actually needed
    getSortedPortfolioItemModels(ordering) {
        return this.getSortedPortfolioNames(ordering).map(item => this.items[item])
    }

    get portfolioJSON() {
        return Object.keys(this.items).reduce((acc, item) => {
            acc[item] = { amount: this.items[item].amount }
            return acc
        }, {})
    }

    initializeItems(portfolioJSON) {
        for (let id in portfolioJSON) {
            this.addItem(id, portfolioJSON[id].amount)
        }
    }

    addItem(id, amount) {
        try {
            this.items[id] = new ItemModel({
                id,
                amount,
                observer: this.itemObserver,
                settings: this.settings,
            })
            this.items[id].updateMarketData(this.marketData[id] || null, this.bitcoinData)
        } catch (error) {
            if (window.DEBUG) console.error(error)
        }
    }

    updateItem(id) {
        try {
            this.items[id].updateMarketData(this.marketData[id] || null, this.bitcoinData)
            this.items[id].observer(this.items[id])
        } catch (error) {
            if (window.DEBUG) console.error(error)
        }
    }

    updatePortfolio() {
        for (let item in this.items) {
            this.updateItem(item)
        }
    }
}
