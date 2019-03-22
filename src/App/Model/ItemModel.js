import { numToFormattedString } from "./helpers.js"
export class ItemModel {
    constructor({ id, amount, observer, settings }) {
        this.id = id

        this._amount = amount

        this.observer = observer

        this.settings = settings

        this.apiData = {}

        this._cache = {
            numerical: {},
            printable: {},
        }

        Object.preventExtensions(this)
    }

    updateMarketData(newApiData) {
        if (newApiData === null) return false
        if (newApiData !== this.apiData) {
            this.apiData = newApiData

            this._cache = {
                numerical: {},
                printable: {},
            }
        }
    }

    get amount() {
        return this._amount
    }

    set amount(val) {
        if (typeof val !== "number" || isNaN(val)) throw new Error("incorrect amount")
        this._amount = val
        this._cache = {
            numerical: {},
            printable: {},
        }
        this.observer(this, "amount")
    }

    get mcapUSD() {
        return this.getDataOrZero("market_cap", "usd")
    }

    get netValue() {
        let timeperiod = this.settings.priceChangePeriod
        let mainCurrency = this.settings.currentCurrencies.main
        let secondCurrency = this.settings.currentCurrencies.second
        let { netMain } = this.getNumericalDataAgainstCurrencies(timeperiod, mainCurrency, secondCurrency) || 0
        return netMain
    }

    getDataOrZero(prop, currency) {
        try {
            return this.apiData.market_data[prop][currency] ? this.apiData.market_data[prop][currency] : 0
        } catch (e) {
            //console.warn(e)
            return 0
        }
    }

    get printableData() {
        return this.getPrintableDataAgainstCurrencies(
            this.settings.priceChangePeriod,
            this.settings.currentCurrencies.main,
            this.settings.currentCurrencies.second
        )
    }

    //todo: optimize: memoize these 2 functions if they will start becoming a problem for performance
    getNumericalDataAgainstCurrencies(timePeriod, mainCurrency, secondCurrency) {
        let amount = this.amount
        let concattedArgs = timePeriod.toString() + mainCurrency.toString() + secondCurrency.toString()
        if (this._cache.numerical[concattedArgs]) {
            return this._cache.numerical[concattedArgs]
        }
        mainCurrency = mainCurrency.toLowerCase()
        secondCurrency = secondCurrency.toLowerCase()
        //todo make amount an argument

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

        this._cache.numerical[concattedArgs] = res

        return res
    }

    getPrintableDataAgainstCurrencies(timePeriod, mainCurrency, secondCurrency) {
        let concattedArgs = timePeriod.toString() + mainCurrency.toString() + secondCurrency.toString()
        if (this._cache.printable[concattedArgs]) {
            return this._cache.printable[concattedArgs]
        }

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
        } = this.getNumericalDataAgainstCurrencies(timePeriod, mainCurrency, secondCurrency)

        const id = this.id
        const symbol = this.apiData.symbol ? this.apiData.symbol : ""
        const name = this.apiData.name ? this.apiData.name : ""
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
            id,
            symbol,
            name,
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
        this._cache.printable[concattedArgs] = res
        return res
    }
}
