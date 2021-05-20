const MongoDBManager = require("../openidl-extraction-pattern-developer/service/mongo-database-manager");
const fileProcessor = require("./FileProcessor");
const fs = require("fs");
const { exit } = require("process");
const TARGET_DB = "database";
const TARGET_CSV = "csv";
const target = TARGET_DB;
const fetch = require("node-fetch");

module.exports.writeTotalsToCSV = function writeTotalsToCSV(totals, fileName) {
    let csv = "source,lob,state,transaction,records,amount\n";
    let overallTotals = { amount: 0, recordCount: 0 };
    for (let source in totals) {
        let totalSource = { amount: 0, recordCount: 0 };
        for (let lob in totals[source]) {
            let totalLOB = { amount: 0, recordCount: 0 };
            for (let state in totals[source][lob]) {
                let totalState = { amount: 0, recordCount: 0 };
                for (let transactionCode in totals[source][lob][state]) {
                    let transactionCodeRecord =
                        totals[source][lob][state][transactionCode];
                    // console.log(` ${source} ${lob} ${state} ${transactionCode} => records ${transactionCodeRecord.recordCount} amount ${transactionCodeRecord.amount}`)
                    csv =
                        csv +
                        `"${source}","${lob}","${state}","${transactionCode}",${transactionCodeRecord.recordCount},${transactionCodeRecord.amount}\n`;
                    totalState.amount += transactionCodeRecord.amount;
                    totalState.recordCount += transactionCodeRecord.recordCount;
                    totalLOB.amount += transactionCodeRecord.amount;
                    totalLOB.recordCount += transactionCodeRecord.recordCount;
                    totalSource.amount += transactionCodeRecord.amount;
                    totalSource.recordCount += transactionCodeRecord.recordCount;
                    overallTotals.amount += transactionCodeRecord.amount;
                    overallTotals.recordCount += transactionCodeRecord.recordCount;
                }
                // console.log(` ${source} ${lob} ${state} => records ${totalState.recordCount} amount ${totalState.amount}`)
            }
            // console.log(` ${source} ${lob} => records ${totalLOB.recordCount} amount ${totalLOB.amount}`)
        }
        // console.log(` ${source} => records ${totalSource.recordCount} amount ${totalSource.amount}`)
    }
    // console.log(` overall => records ${overallTotals.recordCount} amount ${overallTotals.amount}`)

    fs.writeFileSync(`${fileName}.csv`, csv);
};

module.exports.loadData = async function loadData(
    dataFolder,
    apiUrl,
    dbUrl,
    dbName,
    collectionName,
    useAPI = false,
    carrierId,
    token = "",
    chunkSize = 10000,
    maxRecordsToProcess = -1
) {
    var dbManager = null;
    if (!useAPI) {
        dbManager = new MongoDBManager({ url: dbUrl });

        await dbManager.connect();
        await dbManager.useDatabase(dbName).catch((err) => {
            throw err;
        });
        // await dbManager.dropCollection(collectionName).catch((err) => {
        //     throw err;
        // });
    }

    let dataFileNames = fs.readdirSync(dataFolder);

    // Load all the data from the test files
    let auditInfo = [];
    let totals = {};
    for (let dataFileName of dataFileNames) {
        let sequenceNo = 0;

        console.log(`Processing ${dataFileName}`);
        let contents = fs.readFileSync(dataFolder + dataFileName, "utf8");
        let start = 0;
        let recordCount = fileProcessor.countTextRecords(contents);
        do {
            let chunkResults = fileProcessor.processTextRecords(
                contents,
                chunkSize,
                start,
                start + chunkSize
            );
            let allResults = [];
            // let results = fileProcessor.processTextRecords(contents)
            for (let chunkResult of chunkResults) {
                for (let record of chunkResult.records) {
                    record.sourceId = dataFileName;
                    record.batchId = "1111";
                    record.chunkId = chunkResult.chunkId;
                    record.carrierId = carrierId;
                    record.policyNo = "1111111";
                    record.errFlg = false;
                    record.errrLst = [];
                    record.SquenceNum = sequenceNo;
                    record["_id"] = dataFileName + '_' + chunkResult.chunkId + '_' + sequenceNo.toString();

                    allResults.push(record);
                    let auditRecord = {
                        source: dataFileName,
                        lineOfBusiness: record.metaData.lineOfBusiness,
                        transactionCode: record.metaData.transactionCode,
                        state: record.metaData.state,
                        amount: record.metaData.amount,
                    };
                    auditInfo.push(auditRecord);
                    addToAuditTotals(totals, auditRecord);
                    sequenceNo = sequenceNo + 1;
                }
                console.log(
                    "About to load from " +
                    start +
                    " to " +
                    (start + chunkSize) +
                    " of " +
                    recordCount +
                    " records from " +
                    dataFileName
                );
                if (useAPI) {
                    chunkResult.sourceId = dataFileName;
                    chunkResult.carrierId = carrierId;
                    console.log('chunk size: ' + chunkResult.records.length)
                    console.log(`chunk info - sourceId:${chunkResult.sourceId}, carrierId:${chunkResult.carrierId}, recordCound:${chunkResult.records.length}`)
                    await callAPI(apiUrl, chunkResult, token);
                } else {
                    await dbManager
                        .loadData(allResults, dbName, collectionName)
                        .catch((err) => {
                            throw err;
                        });
                    allResults = []
                }
                start = start + chunkSize;
            }
        } while (
            start < recordCount &&
            (maxRecordsToProcess <= 0 || start < maxRecordsToProcess)
        );
    }
    return totals;
};

async function callAPI(apiUrl, payload, token) {
    try {
        console.log("Calling API with batch: ", payload.batchId)
        let response = await fetch(apiUrl + "openidl/api/load-insurance-data", {
            // const baseURL = 'http://localhost:8080/openidl/'
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify(payload),
        });
        if (response.status !== 200) {
            console.log(response)
            if (response.status !== 504) {
                process.exit(0)
            }
        }
    } catch (error) {
        console.log("Error with post of insurance data " + error);
        return;
    }
}

function addToAuditTotals(totals, auditRecord) {
    totalSource = totals[auditRecord.source];
    if (!totalSource) {
        totalSource = {};
        totals[auditRecord.source] = totalSource;
    }
    let totalLOB = totalSource[auditRecord.lineOfBusiness];
    if (!totalLOB) {
        totalLOB = {};
        totalSource[auditRecord.lineOfBusiness] = totalLOB;
    }
    let totalState = totalLOB[auditRecord.state];
    if (!totalState) {
        totalState = {};
        totalLOB[auditRecord.state] = totalState;
    }
    let totalTransactionCode = totalState[auditRecord.transactionCode];
    if (!totalTransactionCode) {
        totalTransactionCode = { amount: 0, recordCount: 0 };
        totalState[auditRecord.transactionCode] = totalTransactionCode;
    }
    totalTransactionCode.amount += auditRecord.amount;
    totalTransactionCode.recordCount += 1;
}

async function processThem(totalsFileName, dataFolder, carrierId, dbUrl, apiUrl, dbName, collectionName, useAPI, chunkSize) {
    // const dataFolder = "covid-files/input/trv/";
    const maxRecordsToProcess = -1; // use -1 to read all records
    // const carrierId = 'HIG';
    // const carrierId = 'TRV';
    const token = process.env.IBMCLOUD_API_TOKEN;
    if (!token) {
        console.error('There is no token.  Please set IBMCLOUD_API_TOKEN environment variable.')
        // process.exit(0)
    }
    let results = await module.exports.loadData(
        dataFolder,
        apiUrl,
        dbUrl,
        dbName,
        collectionName,
        useAPI,
        carrierId,
        token,
        chunkSize,
        maxRecordsToProcess
    );
    module.exports.writeTotalsToCSV(results, totalsFileName);
}
let startTime, endTime;
startTime = new Date();
let totalsFileName = 'covid-files/totals/totals-not-hig-or-trv-ppp-nr'
let inputPath = 'covid-files/input/not_hig_or_trv_populated/'
let carrierId = 'ANY'
let dbUrl = 'mongodb://localhost:27017'
let dbName = 'openidl-offchain-db-ppp-any-nr'
let collectionName = 'insurance_trx_db_' + carrierId
let useAPI = false
let chunkSize = 1000
// const ubaseURLrl = 'http://insurance-data-manager-aais.test.io/openidl/'
// hig
// const baseURL = "https://openidl-insurance-data-manager.stage-aais-hig-apps-clstr-93fbc942734a2ff6b0991658d589b54e-0000.us-east.containers.appdomain.cloud/";
// trv
let apiUrl = 'https://openidl-insurance-data-manager.stage-aais-trv-apps-clstr-93fbc942734a2ff6b0991658d589b54e-0000.us-east.containers.appdomain.cloud/'
// const baseURL = 'http://insurance-data-manager-service.default.svc.cluster.local/openidl/'
// const baseURL = 'http://insurance-data-manager-service:8080/openidl/'
// const baseURL = 'http://192.168.64.8:32211/openidl/'
processThem(totalsFileName, inputPath, carrierId, dbUrl, apiUrl, dbName, collectionName, useAPI, chunkSize).then(() => {
    console.log("Done");
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    exit();
});

