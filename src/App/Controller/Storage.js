export class Storage {
    constructor(model) {
        this.model = model
        this.testPermissions()

        window.EE.on("itemChange", itemStrings => {
            if (itemStrings.__amountWasChanged__) {
                this.savePortfolio()
            }
        })

        window.EE.on("saveNotifications", this.saveNotifications, this)
    }

    onLaunch() {
        this.loadSettings()

        this.loadPortfolio()

        this.loadNotifications()
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

    saveNotifications(notificationsJSON) {
        localStorage.setItem("notifications", JSON.stringify(notificationsJSON))
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

    loadNotifications() {
        let notifications = JSON.parse(localStorage.getItem("notifications") || "{}")
        window.EE.emit("initNotifications", notifications)
    }

    saveTotalValSnapshot(snapshot) {
        let snapshots = JSON.parse(localStorage.getItem("totalValSnapshots") || "[]")
        snapshots.push(snapshot)
        localStorage.setItem("totalValSnapshots", JSON.stringify(snapshots))
    }
}
