const { exit } = require("process");
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const pppUtility = require('./ppp-utility')

async function processThem(inputFolder, outputFolder) {
    let dataFileNames = fs.readdirSync(inputFolder);
    let addresses = await processStates(5000)
    console.log(addresses.length)

    for (let dataFileName of dataFileNames) {
        console.log('Processing: ' + dataFileName)
        let fileStartTime = new Date();
        let statLines = fs.readFileSync(inputFolder + dataFileName, "utf8")
        statLines = statLines.split('\n') //.slice(0, 100)
        let contentOut = ''
        let currentIndex = 0
        let loopCount = 0
        for (line of statLines) {
            let result = loopCount++ % 4 !== 0 ? addresses[currentIndex++] : null
            // console.log(JSON.stringify(result))
            let statLine = line
            if (result && result.fields) {
                // console.log(JSON.stringify(result.fields))
                let filler = '                                            ' // get out to address
                let addressTextTemp = result.fields.BorrowerAddress[0] + ' ' + result.fields.BorrowerCity[0] + ' ' + result.fields.BorrowerState[0] + ' ' + result.fields.BorrowerZip[0] + ' '
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
                statLine = pppUtility.saltLine(line.padEnd(151), salt)
                // console.log(`this one matches ${statLine}`)
            }
            contentOut += statLine + '\n'

            if (currentIndex === addresses.length) {
                currentIndex = 0
            }
        }
        fs.writeFileSync(`${outputFolder}salty-${dataFileName}.txt`, contentOut)
        let fileEndTime = new Date();
        let timeDiff = fileEndTime - fileStartTime;
        timeDiff /= 1000;
        let seconds = Math.round(timeDiff)
        console.log(`   Elapsed time: ${seconds} seconds`)
    }
}

async function processStates(max) {
    let states = ['AL', 'CA', 'CT', 'MD', 'MS', 'NJ', 'ND', 'PA', 'VA']
    let allAddresses = []
    for (state of states) {
        let myClient = new Client({ node: esUrl, maxRetries: 5, requestTimeout: 6000, sniffOnStart: true })
        let stateAddresses = await pppUtility.searchByState(myClient, state, max)
        myClient.close()
        allAddresses = allAddresses.concat(stateAddresses)
        console.log(`found ${stateAddresses.length} in ${state}`)
    }
    console.log(`found ${allAddresses.length} in all states`)
    return allAddresses
}

// USAGE: node address-populator covid-files/input/not_hig_or_trv_split/ covid-files/input/not_hig_or_trv_populated/

let startTime, endTime;
startTime = new Date();
let inputPath = process.argv[2] ? process.argv[2].toString() : 'covid-files/input/not_hig_or_trv_split/'
let outputFolder = process.argv[3] ? process.argv[3] : 'covid-files/input/not_hig_or_trv_populated/'
let esUrl = 'http://localhost:9200'

processThem(inputPath, outputFolder).then(() => {
    console.log("Done");
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    exit();
});



