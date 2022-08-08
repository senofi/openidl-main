/**
 * Sample file with map and reduce functions used to create an extraction pattern.
 */

 let vins = require("../data/vins.json")

 function map() {
    let queryDate = "2022-06-15"
    if (this.effectiveDate <= queryDate && this.expirationDate >= queryDate){
        emit(
            this.vin, this.expirationDate
        )
    }
}
function reduce(key, value) {
    //return {"key": key, "value": value};

    return {"vin": key, "expiration": value[0]}
}

exports.map = map
exports.reduce = reduce