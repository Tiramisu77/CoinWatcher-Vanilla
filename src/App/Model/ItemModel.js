import { numToFormattedString } from "./helpers.js"
export class ItemModel {
    constructor({ name, amount, observer, settings }) {
        this.name = name

        this._amount = amount

        this.observer = observer

        this.settings = settings

        this.apiData = {}
    }

    updateMarketData(newApiData) {
        if (newApiData === null) return false
        if (newApiData !== this.apiData) {
            this.apiData = newApiData
        }
    }

    getNumericalData() {
        const priceUSD = this._priceUSD || 0
        const priceBTC = this._priceBTC || 0
        const amount = this.amount || 0
        const netUSD = amount * priceUSD || 0
        const netBTC = amount * priceBTC || 0
        const changeUSDPerc = 0
        const netUSDchangeAbs = (changeUSDPerc / 100) * netUSD || 0
        const changeBTCPerc = 0
        const netBTCchangeAbs = (changeBTCPerc / 100) * netBTC || 0
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

        return res
    }

    getDataOrZero(prop, currency) {
        try {
            return this.apiData.market_data[prop][currency] ? this.apiData.market_data[prop][currency] : 0
        } catch (e) {
            //console.warn(e)
            return 0
        }
    }

    getNumericalDataAgainstCurrencies(timePeriod, mainCurrency, secondCurrency) {
        mainCurrency = mainCurrency.toLowerCase()
        secondCurrency = secondCurrency.toLowerCase()
        let amount = this.amount

        let priceMain = this.getDataOrZero("current_price", mainCurrency)
        let netMain = priceMain * amount
        let changeMainPerc = this.getDataOrZero(`price_change_percentage_${timePeriod}_in_currency`, mainCurrency)
        let changeMainAbs = (changeMainPerc / 100) * netMain

        let priceSecond = this.getDataOrZero("current_price", secondCurrency)
        let netSecond = priceSecond * amount
        let changeSecondPerc = this.getDataOrZero(`price_change_percentage_${timePeriod}_in_currency`, secondCurrency)
        let changeSecondAbs = (changeSecondPerc / 100) * netSecond

        let res = {
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

        return res
    }

    //app.controller.model._portfolioModel.items.ETH.getPrintableDataAgainstCurrencies("24h")
    getPrintableDataAgainstCurrencies(timeperiod, mainCurrency, secondCurrency) {
        let {
            amount,
            priceMain,
            netMain,
            changeMainPerc,
            changeMainAbs,
            priceSecond,
            netSecond,
            changeSecondPerc,
            changeSecondAbs,
        } = this.getNumericalDataAgainstCurrencies(timeperiod, mainCurrency, secondCurrency)

        const name = this.name
        const fullName = this.apiData.name ? this.apiData.name : ""
        const icon = this.apiData.image ? this.apiData.image : undefined

        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"

        priceMain = numToFormattedString(priceMain, {
            type: "currency",
            currency: mainCurrency,
            lang,
        })
        netMain = numToFormattedString(netMain, { type: "currency", currency: mainCurrency, lang })
        changeMainPerc = numToFormattedString(changeMainPerc, { type: "percentage", isChange: true })
        changeMainAbs = numToFormattedString(changeMainAbs, {
            type: "currency",
            currency: mainCurrency,
            lang,
            isChange: true,
        })

        priceSecond = numToFormattedString(priceSecond, {
            type: "currency",
            currency: secondCurrency,
            lang,
        })
        netSecond = numToFormattedString(netSecond, { type: "currency", currency: secondCurrency, lang })
        changeSecondPerc = numToFormattedString(changeSecondPerc, { type: "percentage", isChange: true })
        changeSecondAbs = numToFormattedString(changeSecondAbs, {
            type: "currency",
            currency: secondCurrency,
            lang,
            isChange: true,
        })

        const res = {
            name,
            fullName,
            icon,
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

        return res
    }

    get printableData() {
        return this.getPrintableDataAgainstCurrencies(
            this.settings.priceChangePeriod,
            this.settings.currentCurrencies.main,
            this.settings.currentCurrencies.second
        )
    }

    get amount() {
        return this._amount
    }

    set amount(val) {
        if (typeof val !== "number" || isNaN(val)) throw new Error("incorrect amount")
        this._amount = val

        this.observer(this, "amount")
    }
}
