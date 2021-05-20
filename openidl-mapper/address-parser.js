const { exit } = require("process");
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const parser = require('parse-address')
const pppUtility = require('./ppp-utility')

async function processThemThatHaveAddress(inputFolder, outputFolder) {
    let dataFileNames = fs.readdirSync(inputFolder);

    for (let dataFileName of dataFileNames) {
        console.log('Processing: ' + dataFileName)
        let fileStartTime = new Date();
        let searched = {}
        let statLines = fs.readFileSync(inputFolder + dataFileName, "utf8")
        statLines = statLines.split('\n') //.slice(0, 100)
        let contentOut = ''
        for (line of statLines) {
            // console.log(line)
            let address = pppUtility.extractAddress(line)
            // console.log(JSON.stringify(address))
            let key = JSON.stringify(address)
            let result
            let found = searched[key]
            if (found) {
                if (found !== 'not found') {
                    result = searched[key]
                } else {
                    result = found
                }
            } else {
                let myClient = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 6000, sniffOnStart: true })
                result = await pppUtility.searchByAddress(myClient, address)
                if (result.fields) {
                    searched[key] = result
                } else {
                    searched[key] = 'not found'
                }
            }
            let statLine = line
            if (result.fields) {
                // console.log(JSON.stringify(result.fields))
                let pppIndicator = 'Y'
                let naicsCode = result.fields.NAICSCode[0].padEnd(6)
                let jobsReported = result.fields.JobsReported[0].padEnd(5)
                let processingMethod = result.fields.ProcessingMethod[0].padEnd(3)
                let ruralUrbanIndicator = result.fields.RuralUrbanIndicator[0].padEnd(1)
                let cd = result.fields.CD[0].padEnd(10)
                let race = result.fields.Race[0].padEnd(10)
                let initialApprovalAmount = result.fields.InitialApprovalAmount[0].padEnd(10)
                let currentApprovalAmount = result.fields.CurrentApprovalAmount[0].padEnd(10)
                let salt = `${pppIndicator}${naicsCode}${jobsReported}${processingMethod}${ruralUrbanIndicator}${cd}${race}${initialApprovalAmount}${currentApprovalAmount}`
                statLine = pppUtility.saltLine(line, salt)
                // console.log(`this one matches ${statLine}`)
            }
            contentOut += statLine + '\n'
        }
        fs.writeFileSync(`${outputFolder}salty-${dataFileName}.txt`, contentOut)
        let fileEndTime = new Date();
        let timeDiff = fileEndTime - fileStartTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff)
        console.log(`   Elapsed time: ${seconds} seconds`)
    }
}

async function processThemThatDontHaveAddress(inputFolder, outputFolder) {
    let dataFileNames = fs.readdirSync(inputFolder);

    for (let dataFileName of dataFileNames) {
        console.log('Processing: ' + dataFileName)
        let fileStartTime = new Date();
        let searched = {}
        let statLines = fs.readFileSync(inputFolder + dataFileName, "utf8")
        statLines = statLines.split('\n') //.slice(0, 100)
        let contentOut = ''
        for (line of statLines) {
            let myClient = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 6000, sniffOnStart: true })
            let isPrem = pppUtility.isPrem(line)
            let address
            if (isPrem) {
                let policyNumber = pppUtility.getPolicyNumber(line)
                address = await pppUtility.getPolicyAddress(myClient, policyNumber)
            } else {
                let claimNumber = pppUtility.getClaimNumber(line)
                address = await pppUtility.getClaimAddress(myClient, claimNumber)
            }
            myClient.close()
            // console.log(JSON.stringify(address))
            let key = JSON.stringify(address)
            let result
            let found = searched[key]
            if (found) {
                if (found !== 'not found') {
                    result = searched[key]
                } else {
                    result = found
                }
            } else if (address.address) {
                let myClient = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 6000, sniffOnStart: true })
                result = await pppUtility.searchByAddressSimple(myClient, address)
                myClient.close()
                if (result.fields) {
                    searched[key] = result
                } else {
                    searched[key] = 'not found'
                }
            }
            let statLine = line
            if (result && result.fields) {
                // console.log(JSON.stringify(result.fields))
                let filler = '                                            ' // get out to address
                let addressTextTemp = address.address + ' ' + address.city + ' ' + address.state + ' ' + address.zip + ' '
                let addressText = addressTextTemp.padEnd(150)
                let pppIndicator = 'Y'
                let naicsCode = result.fields.NAICSCode[0].padEnd(6)
                let jobsReported = result.fields.JobsReported[0].padEnd(5)
                let processingMethod = result.fields.ProcessingMethod[0].padEnd(3)
                let ruralUrbanIndicator = result.fields.RuralUrbanIndicator[0].padEnd(1)
                let cd = result.fields.CD[0].padEnd(10)
                let race = result.fields.Race[0].padEnd(10)
                let initialApprovalAmount = result.fields.InitialApprovalAmount[0].padEnd(10)
                let currentApprovalAmount = result.fields.CurrentApprovalAmount[0].padEnd(10)
                let salt = `${filler}${addressText}${pppIndicator}${naicsCode}${jobsReported}${processingMethod}${ruralUrbanIndicator}${cd}${race}${initialApprovalAmount}${currentApprovalAmount}`
                statLine = pppUtility.saltLine(line, salt)
                // console.log(`this one matches ${statLine}`)
            }
            contentOut += statLine + '\n'
        }
        fs.writeFileSync(`${outputFolder}salty-${dataFileName}.txt`, contentOut)
        let fileEndTime = new Date();
        let timeDiff = fileEndTime - fileStartTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff)
        console.log(`   Elapsed time: ${seconds} seconds`)
    }
}

// USAGE: node address-parser withAddress covid-files/input/hig_with_address_spit/
// USAGE: node address-parser withoutAddress covid-files/input/trv-test/ covid-files/input/trv-test/

let startTime, endTime;
startTime = new Date();
let addressWithWithout = process.argv[2]
let inputPath = process.argv[3] ? process.argv[3].toString() : 'covid-files/input/trv/'
let outputFolder = process.argv[4] ? process.argv[4] : 'covid-files/input/trv-test/'
let esUrl = 'http://localhost:9200'

if (addressWithWithout === 'withAddress') {
    processThemThatHaveAddress(inputPath, outputFolder).then(() => {
        console.log("Done");
        endTime = new Date();
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff)
        console.log(`Elapsed time: ${seconds} seconds`)
        exit();
    });
} else if (addressWithWithout === 'withoutAddress') {
    processThemThatDontHaveAddress(inputPath, outputFolder).then(() => {
        console.log("Done");
        endTime = new Date();
        let timeDiff = endTime - startTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff)
        console.log(`Elapsed time: ${seconds} seconds`)
        exit();
    });

} else {
    console.log('Invalid parameter withWithoutAdress ' + addressWithWithout)
}

