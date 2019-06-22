import { ItemModel } from "./ItemModel.js"
import { numToFormattedString } from "./helpers.js"
export class PortfolioModel {
    constructor(settings) {
        this.settings = settings

        this.items = {}
        this.__portfolioVersion__ = 0.11

        window.EE.on("changeItemAmount", this.changeItemAmount, this)
        window.EE.on("newMarketData", this.updateItem, this)
        window.EE.respond("itemStrings", this.getItemStrings, this)
        window.EE.respond("itemApiData", this.getItemApiData, this)

        window.EE.on("updatePortfolio", this.updatePortfolio, this)

        window.EE.respond("portfolioStructure", () => {
            return this.printableShares
        })
        window.EE.respond("printableDataVsAll", this.getCoinVersusData, this)

        Object.preventExtensions(this)
    }

    getItemApiData(id) {
        return this.items[id].apiData
    }

    getItemStrings(id) {
        return this.items[id].printableData
    }

    changeItemAmount(id, amountStr) {
        let amount = Number(amountStr.replace(",", "."))
        this.items[id].amount = amount
        return "ok"
    }

    getCoinVersusData(id) {
        return this.items[id].printableDataVsAll
    }

    getNumTotalValue() {
        let res = []
        let { versusCurrencies } = this.settings

        for (let currency of versusCurrencies) {
            let sum = { currency, totalValue: 0, changePerc: 0, changeAbs: 0 }

            for (let item in this.items) {
                let itemNumData = this.items[item].getNumericalDataAgainstCurrency(
                    this.settings.priceChangePeriod,
                    currency
                )

                sum.totalValue += itemNumData.net
                sum.changeAbs += itemNumData.changeAbs
            }
            sum.changePerc = (sum.changeAbs / (sum.totalValue - sum.changeAbs)) * 100 || 0
            res.push(sum)
        }

        return res
    }

    getPrintableTotalValue() {
        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"
        return this.getNumTotalValue().map(value => {
            let { currency, totalValue, changePerc, changeAbs } = value
            totalValue = numToFormattedString(totalValue, { type: "currency", currency: currency, lang })
            changePerc = numToFormattedString(changePerc, { type: "percentage", isChange: true })
            changeAbs = numToFormattedString(changeAbs, {
                type: "currency",
                currency: currency,
                lang,
                isChange: true,
            })
            return { totalValue, changePerc, changeAbs }
        })
    }

    get printableShares() {
        let res = {}

        let currency = "USD"
        let total = this.getNumTotalValue().find(e => e.currency === currency)
        for (let item in this.items) {
            let { net } = this.items[item].getNumericalDataAgainstCurrency(this.settings.priceChangePeriod, currency)
            res[item] = net / total.totalValue
        }
        return res
    }

    get printableTotalValue() {
        return this.getPrintableTotalValue()
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
            window.EE.emit("itemChange", this.items[item].printableData, this.items[item].printableDataVsAll)
        }
    }
}
