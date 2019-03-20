export class FiatMarketData {
    constructor() {
        this._data = {}
    }

    set data(val) {
        this._data = val
    }

    get data() {
        return this._data
    }
}
