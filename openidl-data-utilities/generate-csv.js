const MongoDBManager = require('../openidl-extraction-pattern-developer/service/mongo-database-manager');
const mongoDBManagerInstance = require('mongodb').MongoClient;
const Parser = require('json2csv')
const fs = require('fs')
const config = require('./config/config.json')

async function initializeDBConnection() {
    connectionURL = `mongodb://${config.carrier.mongo.user}:${config.carrier.mongo.token}@localhost:28017 /openidl-offchain-db?authSource=openidl-offchain-db`

    let dbManager = new MongoDBManager({ url: connectionURL });
    await dbManager.connect()
    return dbManager
}

async function generateCSV(dbName, collectionName, outputFileName, useLocal) {
    console.log("Connecting");
    try {
        let dbManager = await initializeDBConnection(useLocal);
        // no need to connect when using ibm cloud connection
        // await dbManager.connect();
        console.log("Using database: " + dbName);
        await dbManager.useDatabase(dbName).catch((err) => {
            throw err;
        });
        let reduced = await dbManager.getAllRecords(dbName, collectionName);

        let csv = ''
        let increment = 100000
        if (reduced.length < increment) {
            csv = convertToCSV(reduced)
            fs.writeFileSync(outputFileName, csv, (err) => {
                if (err) {
                    console.log('Error writing csv file: ' + err)
                }
            })
        } else {
            let i = 0
            do {
                let increments = reduced.length / increment
                csv = convertToCSV(reduced.slice(i * increment, (i + 1) * increment))
                i++
                fs.writeFileSync(`${outputFileName}.${i.toString()}.csv`, csv, (err) => {
                    if (err) {
                        console.log('Error writing csv file: ' + err)
                    }
                })
            } while (i * increment < reduced.length)
        }

    } catch (err) {
        throw err;
    }
}

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
    console.log('rows ' + rows.length)
    const fields = Object.keys(rows[0])
    console.log('fields ' + fields.length)
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

// let dbName = "covid-report";
// let collectionName = "hds-data";
// let reductionName = "hds-report-input";
let databaseName = config.dbName;
let collectionName = config.collectionName;
let reductionName = config.reductionName;

let outputFile = 'output/output.csv'

let useLocal = true

console.log("Generating CSV");
generateCSV(databaseName, reductionName, outputFile, useLocal).then(() => {
    process.exit(0);
});
