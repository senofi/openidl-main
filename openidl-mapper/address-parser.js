const { exit } = require("process");
const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const parser = require('parse-address')
const pppUtility = require('./ppp-utility')

async function processThem(inputFolder, outputFolder) {
    let dataFileNames = fs.readdirSync(inputFolder);

    for (let dataFileName of dataFileNames) {
        console.log('Processing: ' + dataFileName)
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
                statLine = pppUtility.saltLine(line, result.fields ? `Y${result.fields.NAICSCode[0]}` : '')
                // console.log(`this one matches ${statLine}`)
            }
            contentOut += statLine + '\n'
        }
        fs.writeFileSync(`${outputFolder}salty-${dataFileName}.txt`, contentOut)
    }
}

let startTime, endTime;
startTime = new Date();
let inputPath = process.argv[2] ? process.argv[2].toString() : 'covid-files/input/hig_with_address_split/'
let outputFolder = 'covid-files/input/hig_with_address_ppp_salted/'
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

