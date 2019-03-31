export class SettingsModel {
    constructor(constants) {
        this._version = 1.13
        this._portfolioSortedBy = "netvalDsc"
        this._priceChangePeriod = "24h"
        this._updateInterval = 5 * 1000 * 60
        this.totalValSnapshotInterval = 1000 * 60 * 10
        this._apiList = ["coingecko"]
        this._networkMode = "single"
        this._colorScheme = {
            current: "default",
            default: {
                "--page-bg-color": "#590E79",
                "--main-color": "#3e1350",
                "---secondary-color": "#091919",
                "--main-font-color": "#d3dbe6",
            },
            custom: {
                "--page-bg-color": "#590E79",
                "--main-color": "#3e1350",
                "---secondary-color": "#091919",
                "--main-font-color": "#d3dbe6",
            },
        }

        this._currentCurrencies = {
            main: "USD",
            second: "BTC",
        }

        this.constants = constants

        Object.preventExtensions(this)
    }

    get version() {
        return this._version
    }

    set version(val) {}

    get currentCurrencies() {
        return this._currentCurrencies
    }

    set currentCurrencies(val) {
        this._currentCurrencies = val
    }

    get colorScheme() {
        return this._colorScheme
    }
    set colorScheme(scheme) {
        //signal to turn to default
        if (scheme === "default") {
            this._colorScheme.current = "default"
            return
        }
        // custom scheme
        if (scheme["--main-color"]) {
            this._colorScheme.custom = scheme
            this._colorScheme.current = "custom"
            return
        }
        // loading scheme from localstorage
        this._colorScheme = {
            default: this._colorScheme.default,
            custom: scheme.custom,
            current: scheme.current,
        }
    }
    get networkMode() {
        return this._networkMode
    }
    set networkMode(val) {
        if (val === "single") {
            this._networkMode = val
        } else throw new Error("illegal network mode, reverting to default")
    }
    get priceChangePeriod() {
        return this._priceChangePeriod
    }
    set priceChangePeriod(val) {
        let vals = new Set(["24h", "1h", "7d", "30d", "60d", "200d"])
        if (vals.has(val)) {
            this._priceChangePeriod = val
        } else throw new Error("illegal priceChangePeriod, reverting to default")
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
            version: this.version,
            portfolioSortedBy: this.portfolioSortedBy,
            apiList: this.apiList,
            updateInterval: this.updateInterval,
            priceChangePeriod: this.priceChangePeriod,
            networkMode: this.networkMode,
            colorScheme: this.colorScheme,
            currentCurrencies: this.currentCurrencies,
        }
    }

    importSettings(loadedSettings) {
        if (loadedSettings.version === undefined || this.version > loadedSettings.version) {
            throw new Error(
                `oudated settings object: version ${loadedSettings.version}; current version: ${this.version}`
            )
        }
        for (let key in loadedSettings) {
            try {
                this[key] = loadedSettings[key]
            } catch (e) {
                console.error(e)
            }
        }
        return "ok"
    }
}
