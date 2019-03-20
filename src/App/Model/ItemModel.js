import { numToFormattedString } from "./helpers.js"
export class ItemModel {
    constructor({
        name,
        amount,
        observer,
        settings,
        bitcoinChanges = {
            "24h": null,
            "1h": null,
            "7d": null,
        },
        getFiatMarketData,
    }) {
        this.name = name
        this.fullName = null
        this._amount = amount
        this._priceUSD = null
        this._priceBTC = null
        this._change1h = null
        this._change24h = null
        this._change7d = null
        this.observer = observer
        this.icon = null
        this.settings = settings
        this.bitcoinChanges = bitcoinChanges
        this.currentMarketData = null
        this.getFiatMarketData = getFiatMarketData
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

    getNumericalDataAgainstCurrencies(timePeriod) {
        const {
            priceUSD,
            priceBTC,
            amount,
            netUSD,
            netBTC,
            changeUSDPerc,
            netUSDchangeAbs,
            changeBTCPerc,
            netBTCchangeAbs,
        } = this.getNumericalData(timePeriod)
        const { main, second } = this.settings.currentCurrencies
        const fiatMarketData = this.getFiatMarketData()

        let priceMain = { currency: main, value: priceUSD * fiatMarketData[main] }
        let netMain = { currency: main, value: netUSD * fiatMarketData[main] }
        //todo this is actually not accurate because it ignores the change of a currency
        //but it would require a different API
        //we assume that fiat currencies don't change too much
        let changeMainPerc = { value: changeUSDPerc }
        let changeMainAbs = { currency: main, value: netUSDchangeAbs * fiatMarketData[main] }

        let priceSecond = { currency: second, value: priceUSD * fiatMarketData[second] }
        let netSecond = { currency: second, value: netUSD * fiatMarketData[second] }
        let changeSecondPerc = { value: changeUSDPerc }
        let changeSecondAbs = { currency: second, value: netUSDchangeAbs * fiatMarketData[second] }

        if (main === "BTC") {
            priceMain = { value: priceBTC, currency: "BTC" }
            netMain = { value: netBTC, currency: "BTC" }
            changeMainPerc = { value: changeBTCPerc, currency: "BTC" }
            changeMainAbs = { value: netBTCchangeAbs, currency: "BTC" }
        }

        if (second === "BTC") {
            priceSecond = { value: priceBTC, currency: "BTC" }
            netSecond = { value: netBTC, currency: "BTC" }
            changeSecondPerc = { value: changeBTCPerc, currency: "BTC" }
            changeSecondAbs = { value: netBTCchangeAbs, currency: "BTC" }
        }

        return {
            amount,
            priceMain,
            netMain,
            changeMainPerc,
            changeMainAbs,
            priceSecond,
            netSecond,
            changeSecondPerc,
            changeSecondAbs,
        }
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
