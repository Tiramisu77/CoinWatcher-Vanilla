/* eslint-disable */
import "./style.css"

import { App } from "./App/App.js"

if (process.env.NODE_ENV !== "production") {
    window.DEBUG = true
}

try {
    window.app = new App()
} catch (e) {
    App.catchInitErr(e)
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").then(
        function(registration) {
            console.info("Service worker registered")
        },
        function(error) {
            if (window.DEBUG) console.error("Service worker registration failed:", error)
        }
    )
} else {
    console.error("Service workers are not supported.")
}
