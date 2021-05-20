const { exit } = require("process");
const csv = require('csvtojson')
const fs = require('fs')

async function processThem(fileName) {
    let contents = fs.readFileSync('covid-files/trv-addresses/' + fileName + '.csv', "utf8");
    let start = 0;
    let found = {}
    let result = []
    await csv()
        .fromString(contents)
        .then(async (lines) => {
            for (line of lines) {
                if (!found[line['POL_NBR']] && line['NI_ADDR_LN_1_TXT'] !== '^') {
                    found[line['POL_NBR']] = line
                    result.push(line)
                }
            }
        })
    fs.writeFileSync('covid-files/trv-addresses/' + fileName + '_clean.json', JSON.stringify(result))
}

// USAGE: node clean-policy-addresses AAIS_1

let startTime, endTime;
startTime = new Date();
let fileName = process.argv[2].toString()
processThem(fileName).then(() => {
    console.log("Done");
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff)
    console.log(`Elapsed time: ${seconds} seconds`)
    exit();
});


