export class Storage {
    constructor(model) {
        this.model = model
        this.testPermissions()
    }

    onLaunch() {
        this.loadSettings()

        this.loadPortfolio()
    }

    testPermissions() {
        try {
            localStorage.setItem("permissionsTest", "test")
            const res = localStorage.getItem("permissionsTest")
            localStorage.removeItem("permissionsTest")
            if (res !== "test") {
                throw new Error(`Unexpected localStorage behavior: ${res}, expected "test"`)
            }
        } catch (error) {
            console.error(error)
            alert("this webapp is based on window.localStorage API, please enable cookies and storage")
        }
    }

    loadPortfolio() {
        try {
            const portfolio = JSON.parse(localStorage.getItem("portfolio")) || {}
            this.model.createItemModels(portfolio)
        } catch (err) {
            console.error(err)
        }
    }
    savePortfolio() {
        try {
            localStorage.setItem("portfolio", JSON.stringify(this.model.portfolioJSON))
        } catch (e) {
            console.error(e)
        }
    }
    loadSettings() {
        try {
            let settings = JSON.parse(localStorage.getItem("settings"))

            if (settings) {
                this.model.settings = settings
            }
        } catch (error) {
            console.error(error)
        }
    }

    saveSettings() {
        try {
            localStorage.setItem("settings", JSON.stringify(this.model.settingsJSON))
        } catch (error) {
            console.error(error)
        }
    }

    loadCoinList() {
        let data = JSON.parse(localStorage.getItem("coinlist"))
        if (data === undefined || data === null) return "needs update"
        else if (Date.now() - data.timestamp > 1000 * 60 * 60 * 24 * 3) {
            return "needs update"
        } else {
            for (let api in data) {
                if (api !== "timestamp") {
                    this.model.SupportedCoins[api] = data[api]
                }
            }
            if (Date.now() - data.timestamp > 1000 * 60 * 60 * 24 * 2) {
                return "will need update soon"
            } else return "ok"
        }
    }

    saveCoinList() {
        let data = this.model.SupportedCoins.coinListNoPrefix
        data.timestamp = Date.now()
        localStorage.setItem("coinlist", JSON.stringify(data))
    }
}
