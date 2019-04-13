/* eslint-disable */
import "./style.css"
import { registerSW } from "./registerSW.js"
import { App } from "./App/App.js"

if (process.env.NODE_ENV !== "production") {
    window.DEBUG = true
}

registerSW()
window.app = new App()
