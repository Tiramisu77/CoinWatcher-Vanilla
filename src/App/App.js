import { Controller } from "./Controller/Controller.js"

export class App {
    constructor() {
        try {
            this.controller = new Controller()
        } catch (e) {
            this.catchInitErr(e)
        }
    }

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
                portfolio.data[i.id] = { amount: Math.random() * 100000 }
            }
        }
        portfolio.__portfolioVersion__ = 100
        localStorage.setItem("portfolio", JSON.stringify(portfolio))
        location.reload()
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
