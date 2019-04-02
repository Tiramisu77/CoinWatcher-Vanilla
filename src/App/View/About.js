import "./css/About.css"
import { utils } from "./utils.js"
export class About {
    constructor() {
        this.node = utils.createComponent(
            `
            <div class="page-container">
        <div id="about" >
        <p>
          Coin Watcher is a free, open source and privacy-oriented cryptocurrency portfolio web app.  </p>
        <p>  It stores all user data strictly on client side, while market data is fetched from public API's.</p>
          <p>
          The current API's are:
          <ul>
            <li><a href="https://www.coingecko.com">coingecko.com</a></li>
          </ul>


          </p>
          <p>
          The official page of the project is at <a href="https://github.com/Tiramisu77/CoinWatcher">https://github.com/Tiramisu77/CoinWatcher</a>
          </p>

        </div>
        </div>
        `
        )
    }
}
