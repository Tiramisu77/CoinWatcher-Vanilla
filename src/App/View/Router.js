import { utils } from "./utils.js"

const BASE_URL = "/CoinWatcher"

export class Root {
    constructor(app, main, addCoinWindow, coinDetails, appSettings, about) {
        this.node = utils.createNode({
            tag: "div",
            id: "root",
            appendTo: app,
        })

        this.routes = {
            "/AddCoin": addCoinWindow.node,
            "/CoinDetails": coinDetails.node,
            "/Settings": appSettings.node,
            "/About": about.node,
            "/": main.node,
        }

        window.onpopstate = () => {
            const path = window.location.pathname
            const route = path.replace(new RegExp(BASE_URL), "")

            this.render(this.routes[route])
        }

        window.addEventListener("load", () => {
            const path = window.location.pathname
            if (this.routes[path]) {
                this.router(path)
            } else {
                this.router("")
            }
        })
    }
    router(path) {
        if (path === "") path = "/"
        if (window.location.protocol !== "file:") {
            window.history.pushState({}, path, window.location.origin + BASE_URL + path)
        }

        this.render(this.routes[path])
    }
    render(node) {
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild)
        }
        this.node.appendChild(node)
    }
}
