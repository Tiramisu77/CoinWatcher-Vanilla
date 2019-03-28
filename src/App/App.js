import { Controller } from "./Controller/Controller.js"
import { EventEmitter } from "./lib.js"

window.EE = new EventEmitter()

export class App {
    constructor() {
        try {
            this.controller = new Controller()
        } catch (e) {
            this.catchInitErr(e)
        }
    }
    //debugging and testing methods

    exportPortfolio() {
        console.info(localStorage.getItem("portfolio"))
    }

    importPortfolio(jsonStr) {
        localStorage.setItem("portfolio", jsonStr)
    }

    getErrorLog() {
        console.info(localStorage.getItem("criticalErrors"))
    }

    testRandomPortfolio() {
        let a = JSON.parse(localStorage.getItem("coinlist"))

        let portfolio = { data: {} }
        for (let i of a.data) {
            if (Math.random() > 0.993) {
                portfolio.data[i.id] = { amount: Math.random() * 100002 }
            }
        }
        portfolio.__portfolioVersion__ = 100
        localStorage.setItem("portfolio", JSON.stringify(portfolio))
        location.reload()
    }

    exportStorage() {
        let s = {
            portfolio: JSON.parse(localStorage.getItem("portfolio")),
            settings: JSON.parse(localStorage.getItem("settings")),
        }
        console.info(JSON.stringify(s))
    }

    importSotrage(s) {
        let { portfolio, settings } = JSON.parse(s)
        localStorage.setItem("portfolio", JSON.stringify(portfolio))
        localStorage.setItem("settings", JSON.stringify(settings))
    }

    catchInitErr(e) {
        let errStorage = JSON.parse(localStorage.getItem("criticalErrors") || "[]")
        let report = {}
        report.stack = e.stack
        report.message = e.message
        errStorage.push(report)
        localStorage.setItem("criticalErrors", JSON.stringify(errStorage))
        alert(`Critical  ${e}`)
        console.error(e)
    }
}
