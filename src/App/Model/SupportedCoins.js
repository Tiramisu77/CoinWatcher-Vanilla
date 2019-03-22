/* eslint-disable no-debugger */
export class SupportedCoins {
    constructor() {
        this.nameMap = null
        this.idMap = null
        this.symbolMap = null
        this.names = null
        this.symbols = null

        Object.preventExtensions(this)
    }
    // app.controller.model.SupportedCoins.__testInteresection__()
    __testInteresection__() {
        let a = new Set(this.names)
        let b = new Set(this.symbols)
        let intersection = new Set([...a].filter(x => b.has(x)))
        for (let item of intersection) {
            let n = this.nameMap.get(item)
            let s = this.symbolMap.get(item)
            if (n !== s) {
                debugger
            }
        }
        console.info(intersection)
    }

    initizalizeList(listJSON) {
        let keyValArrId = listJSON.map(item => [item.id, item])
        let keyValArrName = listJSON.map(item => [item.name, item])
        let keyValArrSymbol = listJSON.map(item => [item.symbol, item])
        this.nameMap = new Map(keyValArrId)
        this.idMap = new Map(keyValArrName)
        this.symbolMap = new Map(keyValArrSymbol)
        this.names = Array.from(this.nameMap.keys())
        this.symbols = Array.from(this.symbolMap.keys())
    }
    //app.controller.model.SupportedCoins.matchQuery("bt")
    matchQuery(str) {
        //let t1 = performance.now()
        let reg = new RegExp(`^${str}`, "i")

        let names = this.names.filter(name => reg.test(name))
        let symbols = this.symbols.filter(symbol => reg.test(symbol)).map(e => e.toUpperCase())
        //let t2 = performance.now()
        //console.log(t2 - t1)
        return [...names, ...symbols]
    }

    getNameFromQuery(str) {
        str = str.toLowerCase()

        if (this.nameMap.has(str)) {
            return this.nameMap.get(str).name
        }
        if (this.symbolMap.has(str)) {
            return this.symbolMap.get(str).name
        }
        return "unknown"
    }

    getIdFromQuery(str) {
        str = str.toLowerCase()
        if (this.nameMap.has(str)) {
            return this.nameMap.get(str).id
        }
        if (this.symbolMap.has(str)) {
            return this.symbolMap.get(str).id
        }

        return str
    }

    /*set coingecko(data) {
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
    } */
}
