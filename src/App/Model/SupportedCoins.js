export class SupportedCoins {
    constructor() {
        this._coingecko = {}

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

    getCoinIds(ticker) {
        const res = {}
        res.coingecko = this._coingecko[ticker] ? this._coingecko[ticker].id : null

        if (res.coingecko === null) {
            return null
        }
        return res
    }

    getCoinNames(ticker) {
        const res = {}
        res.coingecko = this._coingecko[ticker] ? this._coingecko[ticker].name : null

        if (res.coingecko === null) {
            return null
        }
        return res
    }

    get coinListNoPrefix() {
        const res = {}
        res.coingecko = this._coingecko

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
