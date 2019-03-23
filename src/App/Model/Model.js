import { PortfolioModel } from "./PortfolioModel.js"
import { SettingsModel } from "./SettingsModel.js"
import { SupportedCoins } from "./SupportedCoins.js"
export class Model {
    constructor(constants) {
        this._marketData = {}
        this.versusCurrencies = []
        this._settings = new SettingsModel(constants)
        this._portfolioModel = new PortfolioModel(this.settings)
        this.SupportedCoins = new SupportedCoins()

        Object.preventExtensions(this)
    }

    get settings() {
        return this._settings
    }

    set settings(loadedSettings) {
        this._settings.importSettings(loadedSettings)
    }

    get marketData() {
        return this._marketData
    }

    set marketData(newData) {
        this._marketData = newData
        this._portfolioModel.marketData = this._marketData
    }

    get settingsJSON() {
        return this._settings.settingsJSON
    }

    get portfolioJSON() {
        return this._portfolioModel.portfolioJSON
    }

    get total() {
        return this._portfolioModel.printableTotalValue
    }

    get sortedPortfolioNames() {
        return this._portfolioModel.getSortedPortfolioNames(this.settings.portfolioSortedBy)
    }

    get sortedPortfolioItemModels() {
        return this._portfolioModel.getSortedPortfolioItemModels(this.settings.portfolioSortedBy)
    }

    createItemModels(portfolioJSON) {
        this._portfolioModel.initializeItems(portfolioJSON)
    }

    addItem(item, amount) {
        if (this._portfolioModel.items[item] === undefined) {
            this._portfolioModel.addItem(item, amount)
            return "ok"
        } else return "This item already in portfolio"
    }

    editItemAmount(itemName, amount) {
        this._portfolioModel.items[itemName].amount = amount
    }

    getItemStrings(itemName) {
        return this._portfolioModel.items[itemName].printableData
    }

    deleteItem(itemName) {
        delete this._portfolioModel.items[itemName]
    }

    updatePortfolio() {
        this._portfolioModel.updatePortfolio()
    }

    updateItem(ticker) {
        this._portfolioModel.updateItem(ticker)
    }

    getCoinIds(ticker) {
        return this.SupportedCoins.getCoinIds(ticker)
    }

    getCoinNames(ticker) {
        return this.SupportedCoins.getCoinNames(ticker)
    }
}
