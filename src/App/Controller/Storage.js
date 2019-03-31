export class Storage {
    constructor(model) {
        this.model = model
        this.testPermissions()

        window.EE.on("itemChange", itemStrings => {
            if (itemStrings.__amountWasChanged__) {
                this.savePortfolio()
            }
        })
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
            const portfolio = localStorage.getItem("portfolio")
            if (!portfolio) return
            this.model.createItemModels(JSON.parse(portfolio))
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

    saveTotalValSnapshot(snapshot) {
        let snapshots = JSON.parse(localStorage.getItem("totalValSnapshots") || "[]")
        snapshots.push(snapshot)
        localStorage.setItem("totalValSnapshots", JSON.stringify(snapshots))
    }
}
