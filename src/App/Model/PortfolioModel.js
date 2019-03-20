import { ItemModel } from "./ItemModel.js"
import { numToFormattedString } from "./helpers.js"
export class PortfolioModel {
    constructor(itemObserver, settings) {
        this.itemObserver = itemObserver
        this.settings = settings
        this.marketData = {}
        this.items = {}
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

    getnumericalTotalValue(timePeriod) {
        const total = Object.keys(this.items).reduce(
            (acc, item) => {
                const numericalData = this.items[item].getNumericalData(timePeriod)
                acc.BTC += numericalData.netBTC
                acc.BTCchangeAbs += numericalData.netBTCchangeAbs
                acc.USD += numericalData.netUSD
                acc.USDchangeAbs += numericalData.netUSDchangeAbs
                return acc
            },
            { USD: 0, BTC: 0, BTCchangeAbs: 0, USDchangeAbs: 0 }
        )
        const USDchangePerc = (total.USDchangeAbs * 100) / (total.USD + total.USDchangeAbs) || 0
        const BTCchangePerc = (total.BTCchangeAbs * 100) / (total.BTC + total.BTCchangeAbs) || 0
        return { ...total, USDchangePerc, BTCchangePerc }
    }

    getPrintableValue(numericalData) {
        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"

        const total = numericalData

        const USD = numToFormattedString(total.USD, { type: "currency", currency: "USD", lang })

        const BTC = numToFormattedString(total.BTC, { type: "currency", currency: "BTC", lang })

        const BTCchangeAbs = numToFormattedString(total.BTCchangeAbs, {
            type: "currency",
            currency: "BTC",
            lang,
            isChange: true,
        })

        const BTCchangePerc = numToFormattedString(total.BTCchangePerc, { type: "percentage", isChange: true })

        const USDchangeAbs = numToFormattedString(total.USDchangeAbs, {
            type: "currency",
            currency: "USD",
            lang,
            isChange: true,
        })

        const USDchangePerc = numToFormattedString(total.USDchangePerc, { type: "percentage", isChange: true })

        return {
            USD,
            BTC,
            BTCchangeAbs,
            BTCchangePerc,
            USDchangeAbs,
            USDchangePerc,
        }
    }

    get printableTotalValue() {
        return this.getPrintableValue(this.getnumericalTotalValue(this.settings.priceChangePeriod))
    }

    get mcapAsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let cap1 = this.marketData[elem1] ? parseFloat(this.marketData[elem1].market_cap_usd) : 0
            let cap2 = this.marketData[elem2] ? parseFloat(this.marketData[elem2].market_cap_usd) : 0
            return cap1 - cap2
        })
    }
    get mcapDsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let cap1 = this.marketData[elem1] ? parseFloat(this.marketData[elem1].market_cap_usd) : 0
            let cap2 = this.marketData[elem2] ? parseFloat(this.marketData[elem2].market_cap_usd) : 0
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
            let val1 = this.marketData[elem1]
                ? parseFloat(this.marketData[elem1].price_usd) * this.items[elem1].amount
                : 0
            let val2 = this.marketData[elem2]
                ? parseFloat(this.marketData[elem2].price_usd) * this.items[elem2].amount
                : 0
            return val1 - val2
        })
    }
    get netvalDsc() {
        return Object.keys(this.items).sort((elem1, elem2) => {
            let val1 = this.marketData[elem1]
                ? parseFloat(this.marketData[elem1].price_usd) * this.items[elem1].amount
                : 0
            let val2 = this.marketData[elem2]
                ? parseFloat(this.marketData[elem2].price_usd) * this.items[elem2].amount
                : 0
            return val2 - val1
        })
    }

    getSortedPortfolioNames(ordering) {
        return this[ordering]
    }

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
        for (let itemName in portfolioJSON) {
            this.addItem(itemName, portfolioJSON[itemName].amount)
        }
    }

    addItem(itemName, amount) {
        try {
            this.items[itemName] = new ItemModel({
                name: itemName,
                amount,
                observer: this.itemObserver,
                settings: this.settings,
            })
            this.items[itemName].updateMarketData(this.marketData[itemName] || null, this.bitcoinData)
        } catch (error) {
            if (window.DEBUG) console.error(error)
        }
    }

    updateItem(item) {
        try {
            this.items[item].updateMarketData(this.marketData[item] || null, this.bitcoinData)
            this.items[item].observer(this.items[item])
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
