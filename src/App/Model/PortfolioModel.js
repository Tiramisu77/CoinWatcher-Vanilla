import { ItemModel } from "./ItemModel.js"
import { numToFormattedString } from "./helpers.js"
export class PortfolioModel {
    constructor(settings) {
        this.settings = settings
        this.marketData = {}
        this.items = {}
        this.__portfolioVersion__ = 0.11

        window.EE.on("changeItemAmount", this.changeItemAmount, this)
        window.EE.on("newMarketData", this.updateItem, this)
        window.EE.respond("itemStrings", this.getItemStrings, this)
        window.EE.on("updatePortfolio", this.updatePortfolio, this)
        Object.preventExtensions(this)
    }

    getItemStrings(id) {
        return this.items[id].printableData
    }

    changeItemAmount(id, amountStr) {
        let amount = Number(amountStr.replace(",", "."))
        this.items[id].amount = amount
        return "ok"
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
    getItemStringsList(ordering) {
        return this.getSortedPortfolioNames(ordering).map(item => this.items[item].printableData)
    }

    get portfolioJSON() {
        let res = {}
        res.data = Object.keys(this.items).reduce((acc, item) => {
            acc[item] = { amount: this.items[item].amount }
            return acc
        }, {})
        res.__portfolioVersion__ = this.__portfolioVersion__
        return res
    }

    initializeItems(portfolioJSON) {
        let { __portfolioVersion__, data } = portfolioJSON
        if (__portfolioVersion__ === undefined || __portfolioVersion__ < this.__portfolioVersion__)
            throw new Error(`incompatible portfolio version: ${portfolioJSON.__portfolioVersion__}`)
        for (let id in data) {
            this.addItem(id, data[id].amount)
        }
    }

    addItem(id, amount) {
        try {
            this.items[id] = new ItemModel({
                id,
                amount,

                settings: this.settings,
            })
        } catch (error) {
            if (window.DEBUG) console.error(error)
        }
    }

    updateItem(marketData) {
        let { id } = marketData
        this.items[id].updateMarketData(marketData)
    }

    updatePortfolio() {
        for (let item in this.items) {
            window.EE.emit("itemChange", this.items[item].printableData)
        }
    }
}
