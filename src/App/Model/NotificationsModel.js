export class NotificationsModel {
    constructor() {
        this.priceNotifs = {}
        this.percNotifs = {}

        window.EE.on("newMarketData", this.onNewMarketData, this)
        window.EE.on("addNotification", this.addNotification, this)
        window.EE.on("removeNotification", this.removeNotification, this)
        window.EE.on("initNotifications", this.initializeNotification, this)
        window.EE.on("updateNotification", this.updateNotification, this)
        window.EE.respond("allAlerts", this.getAlerts, this)
        window.EE.on("removeAllNotifs", this.removeAllNotifs, this)
    }
    removeAllNotifs(id) {
        delete this.percNotifs[id]
        delete this.priceNotifs[id]
        this.saveNotifications()
    }
    getAlerts(coinId) {
        let res = []
        if (this.priceNotifs[coinId]) {
            res = this.priceNotifs[coinId]
        }
        if (this.percNotifs[coinId]) {
            res = res.concat(this.percNotifs[coinId])
        }
        return res
    }

    addNotification(data) {
        let { type, coinId } = data
        if (type === "price") {
            let notif = this.createPriceNotif(data)

            if (this.priceNotifs[coinId]) {
                this.priceNotifs[coinId].push(notif)
            } else {
                this.priceNotifs[coinId] = [notif]
            }
        }
        if (type === "perc") {
            data.lastNotification = 0
            data.notifId = window.lib.createId()
            if (this.percNotifs[coinId]) {
                this.percNotifs[coinId].push(data)
            } else {
                this.percNotifs[coinId] = [data]
            }
        }

        this.saveNotifications()
    }

    createPriceNotif(data) {
        let apiData = window.EE.request("itemApiData", data.coinId)
        let currentPrice = apiData.market_data.current_price[data.currency.toLowerCase()]
        data.priceOnCreation = currentPrice
        data.targetIsHigher = data.target > currentPrice
        data.notifId = window.lib.createId()
        return data
    }

    removeNotification(notification) {
        if (notification.type === "price") {
            this.priceNotifs[notification.coinId] = this.priceNotifs[notification.coinId].filter(
                e => e !== notification
            )
        } else {
            this.percNotifs[notification.coinId] = this.percNotifs[notification.coinId].filter(e => e !== notification)
        }
        this.saveNotifications()
    }

    updateNotification() {
        this.saveNotifications()
    }

    checkPriceNotifs(newMarketData) {
        let id = newMarketData.id
        this.priceNotifs[id].forEach(priceNotif => {
            let currentPrice = newMarketData.market_data.current_price[priceNotif.currency.toLowerCase()]

            if (this.checkPriceNotifConditions(priceNotif, currentPrice)) {
                window.EE.emit("showNotification", {
                    notification: priceNotif,
                    data: {
                        price: currentPrice,
                        name: newMarketData.name,
                    },
                })

                this.priceNotifs[id] = this.priceNotifs[id].filter(e => e !== priceNotif)
                this.saveNotifications()
            }
        })
    }

    checkPercNotifs(newMarketData) {
        let id = newMarketData.id
        this.percNotifs[id].forEach(percNotif => {
            let priceChange =
                newMarketData.market_data[`price_change_percentage_${percNotif.period}_in_currency`][
                    percNotif.currency.toLowerCase()
                ]

            let currentPrice = newMarketData.market_data.current_price[percNotif.currency.toLowerCase()]

            let periodMs = window.lib.periodStrToMs(percNotif.period)
            let canFire = Date.now() - percNotif.lastNotification > periodMs
            if (canFire && Math.abs(priceChange) > parseFloat(percNotif.percChange)) {
                window.EE.emit("showNotification", {
                    notification: percNotif,
                    data: {
                        priceChange,
                        currentPrice,
                        name: newMarketData.name,
                    },
                })

                percNotif.lastNotification = Date.now()
                this.saveNotifications()
            }
        })
    }

    onNewMarketData(newMarketData) {
        let id = newMarketData.id

        if (this.priceNotifs[id]) {
            this.checkPriceNotifs(newMarketData)
        }

        if (this.percNotifs[id]) {
            this.checkPercNotifs(newMarketData)
        }
    }

    checkPriceNotifConditions(notification, currentPrice) {
        if (notification.targetIsHigher) {
            return currentPrice > notification.target
        } else {
            return currentPrice < notification.target
        }
    }

    getNotificationsJSON() {
        return {
            priceNotifs: this.priceNotifs,
            percNotifs: this.percNotifs,
        }
    }

    saveNotifications() {
        window.EE.emit("saveNotifications", this.getNotificationsJSON())
    }

    initializeNotification(notificationsJSON) {
        this.priceNotifs = notificationsJSON.priceNotifs || {}
        this.percNotifs = notificationsJSON.percNotifs || {}
    }
}
