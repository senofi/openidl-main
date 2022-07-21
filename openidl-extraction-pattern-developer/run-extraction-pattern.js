const fs = require('fs')
const ExtractionPatternManager = require('./service/extraction-pattern-manager')
const ExtractionPatternProcessor = require('./service/extraction-pattern-processor')
const MongoDBManager = require('./service/mongo-database-manager')
const ep = require('./test/extractionPatterns/nd-extractionPattern');
//const ep = require('./test/extractionPatterns/Trivial_01_ExtractionPattern');
const Parser = require('json2csv')
const config = require("./config.json")
function convertToCSV(json) {
    let rows = []
    for (let item of json) {
        let row = {}
        for (let field in item['_id']) {
            row[field] = item['_id'][field]
        }
        for (let field in item.value) {
            row[field] = item.value[field]
        }
        rows.push(row)
    }
    const fields = Object.keys(rows[0])
    const opts = { fields }

    let csv = null
    try {
        const parser = new Parser.Parser(opts)
        csv = parser.parse(rows)
    } catch (err) {
        console.error(err);
    }
    return csv
}

async function processExtractionPattern() {

    // let dbName = 'openidl-offchain-db'
    // let collectionName = 'insurance_trx_db_HIG'
    // let reductionName = collectionName + '_' + 'covid_19' + '_1'
    let local = true
    let dbUrl = config.db.dbURL
    let dbName = config.db.dbName
    let collectionName = config.db.collectionName
    let reductionName = config.db.reductionName
    var manager = new ExtractionPatternManager()
    var processor
    var map = ep.map
    var reduce = ep.reduce
    var extractionPattern = manager.createExtractionPattern("nd_03", "ND 3", "Covered Personal Auto Policies", "ND", "Personal Auto", map, reduce, "0.1", "2022-06-13T18:30:00Z", "2022-06-15T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "petera@aaisonline.com")
    var dbManager = new MongoDBManager({ url: dbUrl })
    if (!dbManager) {
        throw 'No DB Manager'
    }
    console.log(typeof dbManager)
    const extractionPatternProcessor = new ExtractionPatternProcessor(dbManager, dbName, collectionName, reductionName)

    await dbManager.connect()
    await dbManager.useDatabase(dbName).catch((err) => { throw err })

    await extractionPatternProcessor.processExtractionPattern(extractionPattern)
    console.log(extractionPattern)
    manager.writeExtractionPatternToFile(extractionPattern, 'nd_ExtractionPattern.json')

}

let startTime, endTime;
startTime = new Date();

processExtractionPattern().then(() => {
    console.log('Done...')
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    process.exit(0)
})