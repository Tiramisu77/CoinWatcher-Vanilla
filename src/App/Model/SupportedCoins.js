export class SupportedCoins {
    constructor() {
        this._coingecko = {}
        this._alternativeme = {}
        this._coinmarketcap = {}
        this._coinSymbolsList = null

        Object.preventExtensions(this)
    }
    set coingecko(data) {
        Object.keys(data).forEach(name => {
            this._coingecko[name] = data[name]
        })
        this._coinSymbolsList = null
    }

    get coingecko() {
        return this._coingecko
    }

    set alternativeme(data) {
        Object.keys(data).forEach(name => {
            this._alternativeme[name] = data[name]
        })
        this._coinSymbolsList = null
    }

    get alternativeme() {
        return this._alternativeme
    }

    set coinmarketcap(data) {
        Object.keys(data).forEach(name => {
            this._coinmarketcap[name] = data[name]
        })
        this._coinSymbolsList = null
    }

    get coinmarketcap() {
        return this._coinmarketcap
    }

    getCoinIds(ticker) {
        const res = {}
        res.coingecko = this._coingecko[ticker] ? this._coingecko[ticker].id : null
        res.alternativeme = this._alternativeme[ticker] ? this._alternativeme[ticker].id : null
        res.coinmarketcap = this._coinmarketcap[ticker] ? this._coinmarketcap[ticker].id : null
        if (res.coingecko === null && res.alternativeme === null && res.coinmarketcap === null) {
            return null
        }
        return res
    }

    getCoinNames(ticker) {
        const res = {}
        res.coingecko = this._coingecko[ticker] ? this._coingecko[ticker].name : null
        res.alternativeme = this._alternativeme[ticker] ? this._alternativeme[ticker].name : null
        res.coinmarketcap = this._coinmarketcap[ticker] ? this._coinmarketcap[ticker].name : null
        if (res.coingecko === null && res.alternativeme === null && res.coinmarketcap === null) {
            return null
        }
        return res
    }

    get coinListNoPrefix() {
        const res = {}
        res.coingecko = this._coingecko
        res.alternativeme = this._alternativeme
        res.coinmarketcap = this._coinmarketcap

        return res
    }

    get coinSymbolsList() {
        let res

        if (this._coinSymbolsList) {
            res = this._coinSymbolsList
        } else {
            res = Object.keys(this)
                .reduce((acc, e) => {
                    for (let key in this[e]) {
                        acc.push(key)
                    }
                    return acc
                }, [])
                .reduce((acc, e) => {
                    if (!acc[e[0].toUpperCase()]) {
                        acc[e[0].toUpperCase()] = []
                    }
                    acc[e[0].toUpperCase()].push(e)
                    return acc
                }, {})

            for (let key in res) {
                res[key] = [...new Set(res[key])]
                res[key].sort((a, b) => a.localeCompare(b))
            }
        }
        if (!this._coinSymbolsList) {
            this._coinSymbolsList = res
        }

        return res
    }
}
