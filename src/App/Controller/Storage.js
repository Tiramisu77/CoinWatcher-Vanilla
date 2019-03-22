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
            console.warn("reverting to default settings")
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
        let list = JSON.parse(localStorage.getItem("coinlist"))
        if (list === undefined || list === null) return "needs update"
        if (Date.now() - list.timestamp > 1000 * 60 * 60 * 24 * 3) {
            return "needs update"
        } else {
            this.model.SupportedCoins.initizalizeList(list.data)

            if (Date.now() - list.timestamp > 1000 * 60 * 60 * 24 * 2) {
                return "will need update soon"
            } else return "ok"
        }
    }

    saveCoinList(data) {
        let list = { data, timestamp: Date.now() }

        localStorage.setItem("coinlist", JSON.stringify(list))
    }
}
