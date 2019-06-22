import { numToFormattedString } from "./helpers.js"
export class ItemModel {
    constructor({ id, amount, settings }) {
        this.id = id

        this._amount = amount

        this.settings = settings

        this.apiData = {}

        this._cache = {
            numerical: {},
            printable: {},
            wipe() {
                this.numerical = {}
                this.printable = {}
            },
        }

        Object.preventExtensions(this)
    }

    updateMarketData(newApiData) {
        if (!newApiData) return false
        if (newApiData !== this.apiData) {
            this.apiData = newApiData

            this._cache.wipe()

            window.EE.emit("itemChange", this.printableData)
        }
    }

    get amount() {
        return this._amount
    }

    set amount(val) {
        if (typeof val !== "number" || isNaN(val)) throw new Error("incorrect amount")
        this._amount = val
        this._cache.wipe()
        window.EE.emit("itemChange", { ...this.printableData, __amountWasChanged__: true })
    }

    get mcapUSD() {
        return this.getDataOrZero("market_cap", "usd")
    }

    get netValue() {
        let amount = this.amount
        let price = this.getDataOrZero("current_price", "usd")
        let net = price * amount
        return net
    }

    getDataOrZero(prop, currency) {
        try {
            let n = Number(this.apiData.market_data[prop][currency.toLowerCase()])
            return isNaN(n) ? 0 : n
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

    get printableDataVsAll() {
        let versusData = this.settings.versusCurrencies.map(currency =>
            this.getPrintableDataAgainstCurrency(this.settings.priceChangePeriod, currency)
        )
        const id = this.id
        const symbol = this.apiData.symbol ? this.apiData.symbol : ""
        const name = this.apiData.name ? this.apiData.name : id
        const icon = this.apiData.image
        const amount = this.amount
        return { id, amount, symbol, name, icon, versusData }
    }

    getNumericalDataAgainstCurrency(timePeriod, currency) {
        let amount = this.amount
        let concattedArgs = timePeriod.toString() + currency.toString()
        if (this._cache.numerical[concattedArgs]) {
            return this._cache.numerical[concattedArgs]
        }
        currency = currency.toLowerCase()

        let price = this.getDataOrZero("current_price", currency)
        let net = price * amount
        let changePerc = this.getDataOrZero(`price_change_percentage_${timePeriod}_in_currency`, currency)
        let changeAbs = net - net / (1 + changePerc / 100)
        let ath = this.getDataOrZero("ath", currency)
        let mcap = this.getDataOrZero("market_cap", currency)

        let res = {
            amount,
            price,
            net,
            changePerc,
            changeAbs,
            ath,
            mcap,
        }

        this._cache.numerical[concattedArgs] = res

        return res
    }

    getPrintableDataAgainstCurrency(timePeriod, currency) {
        let concattedArgs = timePeriod.toString() + currency.toString()
        if (this._cache.printable[concattedArgs]) {
            return this._cache.printable[concattedArgs]
        }

        let { amount, price, net, changePerc, changeAbs, ath, mcap } = this.getNumericalDataAgainstCurrency(
            timePeriod,
            currency
        )

        const lang = navigator.languages ? navigator.languages[0] : navigator.language ? navigator.language : "en-US"

        price = numToFormattedString(price, {
            type: "currency",
            currency: currency,
            lang,
        })
        net = numToFormattedString(net, { type: "currency", currency: currency, lang })
        changePerc = numToFormattedString(changePerc, { type: "percentage", isChange: true })
        changeAbs = numToFormattedString(changeAbs, {
            type: "currency",
            currency: currency,
            lang,
            isChange: true,
        })

        ath = numToFormattedString(ath, { type: "currency", currency: currency, lang })
        mcap = numToFormattedString(mcap, { type: "currency", currency: currency, lang })

        const res = {
            amount,
            price,
            net,
            changePerc,
            changeAbs,
            ath,
            mcap,
        }
        this._cache.printable[concattedArgs] = res
        return res
    }

    getPrintableDataAgainstCurrencies() {
        const id = this.id

        const res = {
            id,
        }

        return res
    }
}
