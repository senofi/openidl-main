const deepEquals = require('deep-equals')

let emitted = []

module.exports.getEmitted = () => { return emitted}

function emit(key, value) {

    let arrayAtKey = null
    for (emittedItem of emitted) {
        if (deepEquals(emittedItem.key,key)) {
            arrayAtKey = emittedItem.values
        }
    }
    if (arrayAtKey === null) {
        arrayAtKey = []
        emitted.push ({"key":key, "values":arrayAtKey})
    }
    arrayAtKey.push(value)
}

function map() {

    let sourceId = this.sourceId
    let lineOfBusiness = this.lineOfBusiness
    let transactionCode = this.metaData.transactionCode
    let state = this.metaData.state
    let amount = this.metaData.amount
    emit(
        {
            "source":sourceId,
            "state":state,
            "lineOfBusiness":lineOfBusiness,
            "transactionCode":transactionCode
        }, 
        {
            "amount":amount
        }
    ); 
}

function reduce (key,values) {
    let result = {}
    let totalAmount = 0
    for (value of values) {
        totalAmount += value.amount
    }
    result.amount = totalAmount
    return result;
}

exports.map = map
exports.reduce = reduce
