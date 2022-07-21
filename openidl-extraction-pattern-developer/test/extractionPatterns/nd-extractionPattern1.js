/**
 * Sample file with map and reduce functions used to create an extraction pattern.
 */


 function map() {
    let vin = this.vin

    var result = {
        "key": { "vin": vin},
        "value": {
            "chunkId": this.chunkId,
            "effectiveDate": this.effectiveDate,
            "expirationDate": this.expirationDate
        }
    }

    emit(
        1,2
    )

}
function reduce(key, value) {
    return {"key": key, "value": value};
}

exports.map = map
exports.reduce = reduce