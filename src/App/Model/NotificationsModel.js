export class NotificationsModel {
    constructor() {
        this.priceNotifs = {}
        this.percNotifs = {}

        window.EE.on("newMarketData", this.checkNewMarketData, this)
        window.EE.on("addNotification", this.addNotification, this)
        window.EE.on("removeNotification", this.removeNotification, this)
    }

    addNotification(data) {
        let { type, id } = data
        if (type === "price") {
            let notif = this.createPriceNotif(data)

            if (this.priceNotifs[id]) {
                this.priceNotifs[id].push(notif)
            } else {
                this.priceNotifs[id] = [notif]
            }
        }
        if (type === "perc") {
            data.lastNotification = null

            if (this.percNotifs[id]) {
                this.percNotifs[id].push(data)
            } else {
                this.percNotifs[id] = [data]
            }
        }
    }

    createPriceNotif(data) {
        let apiData = window.EE.request("itemApiData", data.id)
        let currentPrice = apiData.market_data.current_price[data.currency.toLowerCase()]
        data.priceOnCreation = currentPrice
        data.targetIsHigher = data.target > currentPrice
        return data
    }

    removeNotification(notifId) {}

    checkNewMarketData(newMarketData) {
        let { id } = newMarketData

        if (this.priceNotifs[id]) {
            this.priceNotifs[id].forEach(priceNotif => {
                let currentPrice = newMarketData.market_data.current_price[priceNotif.currency.toLowerCase()]

                if (this.checkPriceNotifConditions(priceNotif, currentPrice)) {
                    new Notification(`Notification: ${id} ${currentPrice} ${priceNotif.target}`)
                    console.info(`Notification: ${id} ${currentPrice} ${priceNotif.target}`)
                    this.priceNotifs[id] = this.priceNotifs[id].filter(e => e !== priceNotif)
                }
            })
        }

        if (this.percNotifs[id]) {
        }
    }

    checkPriceNotifConditions(notification, currentPrice) {
        if (notification.targetIsHigher) {
            return currentPrice > notification.target
        } else {
            return currentPrice < notification.target
        }
    }

    getNotificationsJSONstr() {
        return JSON.stringify({
            priceNotifs: this.priceNotifs,
            percNotifs: this.percNotifs,
        })
    }
}
