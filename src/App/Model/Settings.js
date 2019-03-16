export class Settings {
    constructor(constants) {
        this._portfolioSortedBy = "netvalDsc"
        this._priceChangePeriod = "24h"
        this._updateInterval = 15 * 1000 * 60
        this._apiList = ["coingecko", "alternativeme", "coinmarketcap"]
        this._networkMode = "single"
        this._colorScheme = {
            current: "default",
            default: {
                "--main-bg-color": "#3e1350",
                "--main-bg-color-bottom": "#2b2b35",
                "--secondary-bg-color": "#091919",
                "--main-font-color": "#d3dbe6",
            },
            custom: {
                "--main-bg-color": "#3e1350",
                "--main-bg-color-bottom": "#2b2b35",
                "--secondary-bg-color": "#091919",
                "--main-font-color": "#d3dbe6",
            },
        }
        this.constants = constants
    }

    get colorScheme() {
        return this._colorScheme
    }
    set colorScheme(scheme) {
        if (scheme === "default") {
            this._colorScheme.current = "default"
            return
        }
        if (scheme["--main-bg-color"]) {
            this._colorScheme.custom = scheme
            this._colorScheme.current = "custom"
            return
        }
        this._colorScheme = scheme
    }
    get networkMode() {
        return this._networkMode
    }
    set networkMode(val) {
        if (val === "batch" || val === "single") {
            this._networkMode = val
        } else throw new Error("illegal network mode, reverting to default")
    }

    set priceChangePeriod(val) {
        let vals = new Set(["24h", "1h", "7d"])
        if (vals.has(val)) {
            this._priceChangePeriod = val
        } else throw new Error("illegal priceChangePeriod, reverting to default")
    }
    get priceChangePeriod() {
        return this._priceChangePeriod
    }
    get portfolioSortedBy() {
        return this._portfolioSortedBy
    }

    set portfolioSortedBy(val) {
        let vals = new Set(["alphaAsc", "alphaDsc", "netvalAsc", "netvalDsc", "mcapAsc", "mcapDsc"])
        if (vals.has(val)) {
            this._portfolioSortedBy = val
        } else throw new Error("illegal sorted by setting, reverting to default")
    }

    get updateInterval() {
        return this._updateInterval
    }

    set updateInterval(val) {
        if (val >= this.constants.MIN_UPDATE_INTERVAL) {
            this._updateInterval = val
        } else throw new Error("illegal update interval setting, reverting to default")
    }

    get apiList() {
        return this._apiList
    }

    set apiList(val) {
        let apiSet = new Set(val)
        this._apiList.forEach(e => {
            if (!apiSet.has(e)) throw new Error("incorrect api list, reverting to default")
        })
        this._apiList = val
    }

    get settingsJSON() {
        return {
            portfolioSortedBy: this.portfolioSortedBy,
            apiList: this.apiList,
            updateInterval: this.updateInterval,
            priceChangePeriod: this.priceChangePeriod,
            networkMode: this.networkMode,
            colorScheme: this.colorScheme,
        }
    }

    importSettings(loadedSettings) {
        Object.keys(loadedSettings).forEach(field => {
            try {
                if (this[field]) this[field] = loadedSettings[field]
            } catch (e) {
                if (window.DEBUG) console.warn(e)
            }
        })
    }
}
