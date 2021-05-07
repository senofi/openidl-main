const convertFlatToHDS = require('./LOBProcessor').convertFlatToHDS
const convertCSVToHDS = require('./LOBProcessor').convertCSVToHDS
const processIntoChunks = require('./ChunkProcessor').processIntoChunks
const csv = require('csvtojson')
const fs = require('fs')

/**
 * Process a text string with all the records in flat records delimited by line breaks.
 * @param {*} records 
 * @returns 
 */
module.exports.processTextRecords = function processRecords(records, chunkSize, carrierId, min = 0, max = -1) {

    var linesIn = records.split("\n");

    let lines = (max > -1 ? linesIn.slice(min, max) : linesIn)

    return processIntoChunks(chunkSize, min.toString(), carrierId, lines, convertFlatToHDS)

}

module.exports.processCSVRecords = async function processCSVRecords(records, chunkSize, carrierId) {

    let results = []
    await csv()
        .fromString(records)
        .then((lines) => {
            results = processIntoChunks(chunkSize, '1111', carrierId, lines, convertCSVToHDS)
        })

    return results

}

module.exports.countTextRecords = function countTextRecords(records) {
    var lines = records.split("\n")
    return lines.length - 1
}

