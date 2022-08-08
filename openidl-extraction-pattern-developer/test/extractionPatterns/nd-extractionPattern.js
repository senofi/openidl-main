/**
 * Sample file with map and reduce functions used to create an extraction pattern.
 */

 let vins = require("../data/vins.json")

 function map() {
    let queryMonth = "2022-06"
    if (transactionMonth == queryMonth){
        emit(
            this.vinHash, this.transactionMonth
        )
    }
}
function reduce(key, value) {
    //return {"key": key, "value": value};

    return {"vinHash": key, "expiration": value[0]}
}

exports.map = map
exports.reduce = reduce