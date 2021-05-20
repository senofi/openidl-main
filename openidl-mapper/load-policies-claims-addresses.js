const { exit } = require("process");
const fetch = require("node-fetch");
const csv = require('csvtojson')
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')

async function correlateClaimAddresses(dataFile) {
    let esUrl = 'http://localhost:9200'
    console.log('start correlation of claims to addresses')
    let contents = fs.readFileSync(dataFile, "utf8");
    let start = 0;
    await csv()
        .fromString(contents)
        .then(async (lines) => {
            for (line of lines) {
                let client = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 60000, sniffOnStart: true })
                let { body } = await client.search({
                    index: 'trv-policy-addresses', body: { "query": { "match": { "POL_NBR": '00' + line['POL_NBR'] } } }
                })
                await client.close()
                for (hit of body.hits.hits) {
                    console.log(hit)
                    client = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 60000, sniffOnStart: true })
                    await client.index({ index: 'trv-claim-address', body: { 'CLAIM_NUMBER': line['CLAIM_NUMBER'], 'POL_NBR': line['POL_NBR'], 'ADDRESS': hit._source.NI_ADDR_LN_1_TXT, 'CITY': hit._source.NI_CTY_NM, 'STATE': hit._source.NI_ST_CD, 'ZIP': hit._source.NI_PST_LOC_CD } })
                    await client.close()
                }

            }
        })

}

async function loadCSVData(action, dataFile) {
    console.log('start')

    console.log(`Processing ${dataFile}`);
    let contents = fs.readFileSync(dataFile, "utf8");
    let start = 0;
    await csv()
        .fromString(contents)
        .then(async (lines) => {
            await callAPI(action, lines)
        })

};

async function loadJSONData(action, dataFile) {
    console.log('start')

    console.log(`Processing ${dataFile}`);
    let contents = fs.readFileSync(dataFile, "utf8");
    let start = 0;
    let jsonContents = JSON.parse(contents)
    await callAPI(action, jsonContents)
};

async function callAPI(indexName, records) {
    let esUrl = 'http://localhost:9200'
    let client = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 60000, sniffOnStart: true })
    console.log(`putting`)

    const body = records.flatMap(doc => [{ index: { _index: indexName } }, doc])
    const { body: bulkResponse } = await client.bulk({ refresh: true, body })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: body[i * 2],
                    document: body[i * 2 + 1]
                })
            }
        })
        console.log(erroredDocuments)
    }

    // const { body: count } = await client.count({ index: 'tweets' })
    // console.log(count)
    console.log('Done adding data')
}

async function processThem(action, dataFile) {
    if (action === 'trv-policy-claims' || action === 'trv-claim-addresses') {
        let results = await loadCSVData(action, dataFile)
    } else if (action === 'trv-policy-addresses') {
        let results = await loadJSONData(action, dataFile)
    } else if (action === 'correlate-claim-addresses') {
        let results = await correlateClaimAddresses(dataFile)
    } else {
        console.log(`Action unknown: ${action}`)
    }
}

// USAGE: node load-policies-claims-addresses trv-policy-addresses covid-files/trv-addresses/AAIS_1_clean.json
// USAGE: node load-policies-claims-addresses trv-policy-claims covid-files/trv-addresses/trv_2020_claim_numbers.csv
// USAGE: node load-policies-claims-addresses correlate-claim-addresses covid-files/trv-addresses/trv_2020_claim_numbers.csv
// USAGE: node load-policies-claims-addresses trv-claim-addresses covid-files/trv-addresses/trv_2020_claim_addresses.csv

let startTime, endTime;
startTime = new Date();
let action = process.argv[2].toString()
let inputPath = process.argv[3].toString()
processThem(action, inputPath).then(() => {
    console.log("Done");
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    exit();
});
