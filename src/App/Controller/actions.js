const itemActions = {
    onItemChange: function onItemChange() {
        this.view.sortPortfolio(this.model.sortedPortfolioNames)
        this.view.renderTotal(this.model.total)
    },

    openDetails: function(id) {
        let itemStrings = window.EE.request("itemStrings", id)
        let printableCoinApiData = window.EE.request("printableCoinApiData", id)
        this.view.openDetails(itemStrings, printableCoinApiData)
    },
}

const portfolioActions = {
    addItem: function(itemInput, amountInput) {
        if (itemInput === "" || amountInput === "") return ""

        let itemID = window.EE.request("idFromInput", itemInput)

        let amount = Number(amountInput)
        if (typeof amount !== "number" || isNaN(amount)) return "Amount must a be number"

        let res = this.model.addItem(itemID, amount)
        if (res === "ok") {
            let itemStrings = window.EE.request("itemStrings", itemID)
            this.view.mountItem(itemStrings)
            this.network.loadPircesAndUpdateSingle(itemID)
            this.storage.savePortfolio()

            return "ok"
        } else return res
    },
    removeItem: function(item) {
        this.model.deleteItem(item)
        this.storage.savePortfolio()
        this.view.unmountItem(item)
        this.view.renderTotal(this.model.total)
    },

    switchPriceChangePeriod: function(priceChangePeriod) {
        this.model.settings.priceChangePeriod = priceChangePeriod
        this.storage.saveSettings()
        this.view.renderTotal(this.model.total)
        window.EE.emit("updatePortfolio")
    },
}

const changeSettings = function(msg, val) {
    if (msg === "interval") {
        const num = parseInt(val) * 60 * 1000 // "1 min" -> 60000 ms
        this.model.settings.updateInterval = num

        clearTimeout(this.timer)
        this.network.loop()
    }

    if (msg === "colorScheme") {
        this.model.settings.colorScheme = val
        this.view.changeColorScheme(this.model.settings.colorScheme[this.model.settings.colorScheme.current])
    }

    if (msg === "currencyMain") {
        this.model.settings.currentCurrencies.main = val
        this.view.renderTotal(this.model.total)
        window.EE.emit("updatePortfolio")
    }

    if (msg === "currencySecond") {
        this.model.settings.currentCurrencies.second = val
        this.view.renderTotal(this.model.total)
        window.EE.emit("updatePortfolio")
    }
    this.storage.saveSettings()
}

//we can't use bind here so we have to curry
const sortCurry = function(order) {
    return function() {
        this.model.settings.portfolioSortedBy = order
        this.view.sortPortfolio(this.model.sortedPortfolioNames)
        this.storage.saveSettings()
    }
}

const sortActions = {
    sortByAlphaAsc: sortCurry("alphaAsc"),
    sortByAlphaDsc: sortCurry("alphaDsc"),
    sortByNetvalAsc: sortCurry("netvalAsc"),
    sortByNetvalDsc: sortCurry("netvalDsc"),
    sortByMcapAsc: sortCurry("mcapAsc"),
    sortByMcapDsc: sortCurry("mcapDsc"),
}

export const actions = { ...portfolioActions, ...itemActions, ...sortActions, changeSettings }
