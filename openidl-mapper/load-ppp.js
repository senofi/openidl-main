const { exit } = require("process");
const fetch = require("node-fetch");
const csv = require('csvtojson')
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')

async function loadPPP(
    dataFile,
    client
) {
    console.log('start')
    // let dataFileNames = fs.readdirSync(dataFolder);
    // // await setupIndex(client)

    // for (let dataFileName of dataFileNames) {

    console.log(`Processing ${dataFile}`);
    let contents = fs.readFileSync(dataFile, "utf8");
    let start = 0;
    await csv()
        .fromString(contents)
        .then(async (lines) => {
            await callAPI(client, lines)
            // for (line of lines) {
            //     await callAPI(client, line);
            // }
        })
    // }

};

async function setupIndex(client) {
    client.indices.create({
        index: 'ppp-data'
    }, function (err, resp, status) {
        if (err) {
            console.log(err);
        } else {
            console.log("create", resp);
        }
    });
}

async function callAPI(client, records) {
    // client.ping({ requestTimeout: 30000, }, function (error) {
    //     if (error) {
    //         console.log('elasticsearch is down')
    //     } else {
    //         console.log('Ping succeeded!')
    //     }
    // })
    console.log(`putting`)
    // await client.index({
    //     index: 'testing-data',
    //     body: payload
    // }).then((body) => { console.log(body) }).catch(function (err) {
    //     if (err) {
    //         console.error(err)
    //     }
    // });
    const body = records.flatMap(doc => [{ index: { _index: 'ppp-data' } }, doc])
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

async function processThem(dataFile, client) {
    let results = await loadPPP(
        dataFile,
        client
    );
}

let startTime, endTime;
startTime = new Date();
let inputPath = process.argv[2].toString()
let esUrl = 'http://localhost:9200'
let client = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 60000, sniffOnStart: true })
processThem(inputPath, client).then(() => {
    client.ping({ timeout: 100 }).then((body) => { console.log('ping!') }, (err) => { console.log('inside ping'); if (err) { console.log(err) } else { console.log('Successful Ping!') } })
    console.log("Done");
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    exit();
});

