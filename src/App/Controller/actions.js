const itemActions = {
    itemObserver: function(itemModel, flag) {
        if (flag === "amount") {
            this.storage.savePortfolio()
            setTimeout(() => {
                this.view.sortPortfolio(this.model.sortedPortfolioNames)
            }, 50)
            this.view.renderTotal(this.model.total)
        }
        this.view.renderItem(itemModel.printableData)
    },
    editItem: function(itemName, amountStr) {
        const amount = Number(amountStr.replace(",", "."))

        if (typeof amount !== "number" || isNaN(amount)) return "Amount must be a number"
        this.model.editItemAmount(itemName, amount)

        return "ok"
    },
    openDetails: function(itemName) {
        this.view.openDetails(this.model.getItemStrings(itemName))
    },
}

const portfolioActions = {
    addItem: function(itemInput, amountInput) {
        if (itemInput === "" || amountInput === "") return ""

        let itemID = this.model.SupportedCoins.getIdFromQuery(itemInput)
        let amount = Number(amountInput)
        if (typeof amount !== "number" || isNaN(amount)) return "Amount must a be number"

        let res = this.model.addItem(itemID, amount)
        if (res === "ok") {
            if (this.model.settings.networkMode === "single") {
                this.network.loadPircesAndUpdateSingle(itemID)
            }
            this.storage.savePortfolio()
            this.view.mountItem(this.model.getItemStrings(itemID))
            this.view.sortPortfolio(this.model.sortedPortfolioNames)
            this.view.renderTotal(this.model.total)
            return "ok"
        } else return res
    },
    getAutocompleteList: function(str) {
        try {
            if (str === "") return []
            return this.model.SupportedCoins.getMatchesFromQuery(str)
        } catch (e) {
            if (window.DEBUG) console.error(e)
            return []
        }
    },
    getNameFromId: function(id) {
        return this.model.SupportedCoins.getNameFromQuery(id)
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
        this.model.updatePortfolio()
    },
}

const changeSettings = function(msg, val) {
    if (msg === "interval") {
        const num = parseInt(val.split(" ")[0]) * 60 * 1000 // "1 min" -> 60000 ms
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
        this.model.updatePortfolio()
    }

    if (msg === "currencySecond") {
        this.model.settings.currentCurrencies.second = val
        this.view.renderTotal(this.model.total)
        this.model.updatePortfolio()
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
