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
    //app.controller.model.SupportedCoins.getMatchesFromQuery("bt")
    getMatchesFromQuery(str) {
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

    isInList(id) {
        return this.nameMap.has(id) || this.symbolMap.has(id)
    }

    getIdFromQuery(str) {
        let q = str.toLowerCase()
        if (this.nameMap.has(q)) {
            return this.nameMap.get(q).id
        }
        if (this.symbolMap.has(q)) {
            return this.symbolMap.get(q).id
        }

        return str
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
}
