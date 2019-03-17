import { numToFormattedString } from "./helpers.js"
export class ItemModel {
    constructor({
        name,
        fullName = null,
        amount,
        priceUSD = null,
        priceBTC = null,
        observer,
        icon = null,
        change1h = null,
        change24h = null,
        change7d = null,
        settings,
        bitcoinChanges = {
            "24h": null,
            "1h": null,
            "7d": null,
        },
    }) {
        this.name = name
        this.fullName = fullName
        this._amount = amount
        this._priceUSD = priceUSD
        this._priceBTC = priceBTC
        this._change1h = change1h
        this._change24h = change24h
        this._change7d = change7d
        this.observer = observer
        this.icon = icon
        this.settings = settings
        this.bitcoinChanges = bitcoinChanges

        this.cache = {
            numericalData: { "1h": null, "24h": null, "7d": null },
            printableData: { "1h": null, "24h": null, "7d": null },
        }
        this.currentMarketData = null
    }

    updateMarketData(newMarketData, bitcoinChanges) {
        if (newMarketData === null) return false
        if (newMarketData !== this.currentMarketData) {
            this.currentMarketData = newMarketData
            this.icon = newMarketData.image
            this.fullName = newMarketData.name
            this._priceUSD = parseFloat(newMarketData.price_usd)
            this._priceBTC = parseFloat(newMarketData.price_btc)
            this._change1h = parseFloat(newMarketData.percent_change_1h)
            this._change24h = parseFloat(newMarketData.percent_change_24h)
            this._change7d = parseFloat(newMarketData.percent_change_7d)
            this.bitcoinChanges = bitcoinChanges

            this.cache = {
                numericalData: { "1h": null, "24h": null, "7d": null },
                printableData: { "1h": null, "24h": null, "7d": null },
            }
        }
    }

    getNumericalData(timePeriod) {
        if (this.cache.numericalData[timePeriod] !== null) return this.cache.numericalData[timePeriod]
        const priceUSD = this._priceUSD || 0
        const priceBTC = this._priceBTC || 0
        const amount = this.amount
        const netUSD = amount * priceUSD
        const netBTC = amount * priceBTC
        const changeUSDPerc = this["_change" + timePeriod] || 0
        const netUSDchangeAbs = (changeUSDPerc / 100) * netUSD
        const changeBTCPerc = changeUSDPerc - this.bitcoinChanges[timePeriod] || 0
        const netBTCchangeAbs = (changeBTCPerc / 100) * netBTC
        const res = {
            priceUSD,
            priceBTC,
            amount,
            netUSD,
            netBTC,
            changeUSDPerc,
            netUSDchangeAbs,
            changeBTCPerc,
            netBTCchangeAbs,
        }
        this.cache.numericalData[timePeriod] = res
        return res
    }

    getPrintableData(timePeriod) {
        if (this.cache.printableData[timePeriod] !== null) return this.cache.printableData[timePeriod]
        const name = this.name
        const fullName = this.fullName
        const icon = this.icon
        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"

        const numericalData = this.getNumericalData(timePeriod)

        const amount = numericalData.amount

        const priceUSD = numToFormattedString(numericalData.priceUSD, { type: "currency", currency: "USD", lang })

        const netUSD = numToFormattedString(numericalData.netUSD, { type: "currency", currency: "USD", lang })

        const changeUSDPerc = numToFormattedString(numericalData.changeUSDPerc, { type: "percentage", isChange: true })

        const netUSDchangeAbs = numToFormattedString(numericalData.netUSDchangeAbs, {
            type: "currency",
            currency: "USD",
            lang,
            isChange: true,
        })

        const priceBTC = numToFormattedString(numericalData.priceBTC, { type: "currency", currency: "BTC", lang })

        const netBTC = numToFormattedString(numericalData.netBTC, { type: "currency", currency: "BTC", lang })

        const changeBTCPerc = numToFormattedString(numericalData.changeBTCPerc, { type: "percentage", isChange: true })

        const netBTCchangeAbs = numToFormattedString(numericalData.netBTCchangeAbs, {
            type: "currency",
            currency: "BTC",
            lang,
            isChange: true,
        })

        const res = {
            name,
            fullName,
            icon,
            amount,
            priceUSD,
            priceBTC,
            netUSD,
            netBTC,
            changeUSDPerc,
            changeBTCPerc,
            netUSDchangeAbs,
            netBTCchangeAbs,
        }

        this.cache.printableData[timePeriod] = res
        return res
    }

    get printableData() {
        return this.getPrintableData(this.settings.priceChangePeriod)
    }

    get priceUSD() {
        if (this._priceUSD === null) return 0
        return this._priceUSD
    }

    set priceUSD(val) {
        this._priceUSD = val
    }

    get priceBTC() {
        if (this._priceBTC === null) return 0
        return this._priceBTC
    }

    set priceBTC(val) {
        this._priceBTC = val
    }

    get amount() {
        return this._amount
    }

    set amount(val) {
        if (typeof val !== "number" || isNaN(val)) throw new Error("incorrect amount")
        this._amount = val
        this.cache = {
            numericalData: { "1h": null, "24h": null, "7d": null },
            printableData: { "1h": null, "24h": null, "7d": null },
        }
        this.observer(this, "amount")
    }

    set change1h(val) {
        this._change1h = val
    }

    set change24h(val) {
        this._change24h = val
    }

    set change7d(val) {
        this._change7d = val
    }
}
