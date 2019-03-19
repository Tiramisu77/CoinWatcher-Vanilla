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

    testRandomPortfolio() {
        let a = localStorage.getItem("coinlist")

        let b = JSON.parse(a)

        let portfolio = {}
        for (let key in b.coingecko) {
            if (Math.random() > 0.993) {
                portfolio[key] = { amount: Math.random() * 100000 }
            }
        }
        localStorage.setItem("portfolio", JSON.stringify(portfolio))
        location.reload()
    }

    testCorruptedSettings() {
        localStorage.setItem(
            "settings",
            JSON.stringify({
                apiList: ["baz", "baz", "fff"],
                networkMode: "vvv",
                portfolioSortedBy: "x",
                priceChangePeriod: "14",
                updateInterval: 5,
            })
        )
        location.reload()
    }

    catchInitErr(e) {
        let errStorage = JSON.parse(localStorage.getItem("criticalErrors") || "[]")
        let report = {}
        report.stack = e.stack
        report.message = e.message
        errStorage.push(report)
        localStorage.setItem("criticalErrors", JSON.stringify(errStorage))
        alert(`Critical Error: ${e}`)
        console.error(e)
    }
}
