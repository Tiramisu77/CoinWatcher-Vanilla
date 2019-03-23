import { Head } from "./Head.js"

import { AddCoinWindow } from "./Pages/AddCoinWindow.js"

import { AppSettings } from "./Pages/AppSettings.js"

import { CoinDetails } from "./Pages/CoinDetails.js"

import { Main } from "./Main/Main.js"

import { FooterButtons } from "./FooterButtons.js"

import { About } from "./About.js"

import { Root } from "./Root.js"

export class View {
    constructor(controllerActions) {
        this.node = document.getElementById("app")

        this.router = this.router.bind(this)

        this._Head = new Head(this.node)

        this._Main = new Main(controllerActions)

        this._CoinDetails = new CoinDetails(controllerActions.removeItem, this.router)

        this._AddCoinWindow = new AddCoinWindow(
            controllerActions.addItem,
            this.router,
            controllerActions.getAutocompleteList,
            controllerActions.getNameFromId
        )

        this._AppSettings = new AppSettings(controllerActions.changeSettings, () => {
            this.router("/About")
        })

        this._About = new About()

        this._Root = new Root(
            this.node,
            this._Main,
            this._AddCoinWindow,
            this._CoinDetails,
            this._AppSettings,
            this._About
        )

        this._FooterButtons = new FooterButtons(
            () => {
                this.router("")
            },
            () => {
                this.router("/AddCoin")
            },
            () => {
                this.router("/Settings")
            },
            this.node
        )
    }

    router(path) {
        this._Root.router(path)
    }

    onLaunch(orderedItemModels, total, settings) {
        let i = 0
        for (let itemModel of orderedItemModels) {
            this.mountItem(itemModel.printableData, i)
            i = i + 1
        }
        this.renderTotal(total)
        this.renderSettings(settings)
        this._Main.PortfolioLegend.renderInit(settings.portfolioSortedBy)
        this._Main.ChangePeriodButtons.renderInit(settings.priceChangePeriod)

        this.changeColorScheme(settings.colorScheme[settings.colorScheme.current])
        if (window.location.protocol === "file:") {
            this.router("")
        }
    }

    addAllCurrencyOptions(list, settings) {
        this._AppSettings.addAllCurrencyOptions(list, settings)
    }

    changeColorScheme(colorScheme) {
        const root = document.querySelector(":root")
        for (let rule in colorScheme) {
            root.style.setProperty(rule, colorScheme[rule])
        }
    }

    openDetails(itemStrings) {
        this._CoinDetails.render(itemStrings)
    }

    mountItem(itemStrings, orderIndex) {
        this._Main.PortfolioView.addItem(itemStrings, orderIndex)
    }

    unmountItem(item) {
        this._Main.PortfolioView.removeItem(item)
    }

    sortPortfolio(order) {
        this._Main.PortfolioView.sortView(order)
    }

    renderTotal(total) {
        this._Main.TotalValue.render(total)
    }

    renderSettings(settings) {
        this._AppSettings.render(settings)
    }

    showSpinner() {
        this._Head.showSpinner()
    }

    hideSpinner() {
        this._Head.hideSpinner()
    }

    renderHeadMessage(msg) {
        this._Head.renderHeadMessage(msg)
    }

    wipeHeadMessage() {
        this._Head.wipeHeadMessage()
    }

    clearErrorMessage(msg) {
        this._Head.clearErrorMessage(msg)
    }
}
