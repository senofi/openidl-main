const fileProcessor = require("./FileProcessor");
const fs = require("fs");
const { exit } = require("process");

module.exports.splitRecords = function splitRecords(records, chunkSize, filePath, fileExtension) {

    let isCSV = fileExtension === 'csv'
    let linesIn = records.split("\n");
    let current = 0
    let fileSuffix = 1000
    let headerRecord = isCSV ? linesIn[0] + '\n' : ''
    if (isCSV) { linesIn.shift() } // remove the header row for csvs
    let linesOut = headerRecord
    for (line of linesIn) {
        linesOut = linesOut + line + '\n'
        current++
        if (current % chunkSize === 0) {
            fs.writeFileSync(filePath + '_' + fileSuffix++ + '.' + fileExtension, linesOut)
            // all times after first add the header record back in
            linesOut = headerRecord
        }
    }
    if (linesOut !== headerRecord) {
        fs.writeFileSync(filePath + '_' + fileSuffix++ + '.' + fileExtension, linesOut)
    }
}

/**
 * Put values into records so they create a better report.
 * @param {*} record 
 * @param {*} salts a list of functions that will make changes to the record
 */
module.exports.saltRecord = function saltRecord(unsaltedRecord, salts) {

    let saltedRecord = unsaltedRecord
    for (salt of salts) {
        saltedRecord = salt(saltedRecord)
    }
    return saltedRecord
}

/**
 * Apply the salts to all the records
 * Assume that the salts take into account any conditions necessary to determine if the record should be changed.
 * @param {*} records 
 */
module.exports.saltRecords = function saltRecords(records, salts) {
    let saltedRecords = []
    for (unsaltedRecord of records) {
        saltedRecords.push(this.saltRecord(unsaltedRecord, salts))
    }
    return saltedRecords
}
