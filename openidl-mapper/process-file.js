const fileUntility = require('./file-utility');
const { exit } = require("process");
const fs = require('fs')

if (process.argv.length < 3) {
    console.log("Must have at least one argument")
    console.log("Usage: node process-file.js <arg>")
    console.log(" where arg can be split or salt")
    console.log(" for salt - provide the name of the file with the data and the name of the salts(.js) file and the name of the output file")
    console.log(" for split - provide the name of the file and outputpath chunkSize and filetype which is csv or txt")
    process.exit(1)
}

if (process.argv[2] === 'split') {
    if (process.argv.length < 7) {
        console.log('Must have 3 parameters for split ')
        process.exit(1)
    }
    // const fileName = './test/data/fromSDMA/bp_prem_2020Q2_HIG1.txt'
    // const outputPath = './test/data/fromSDMA/HIG/bp_prem_2020_HIG1'
    let fileName = process.argv[3]
    let outputPath = process.argv[4]
    let chunkSize = process.argv[5]
    let fileExtension = process.argv[6]
    let isCSV = fileExtension === 'csv'
    let contents = fs.readFileSync(fileName, "utf8");
    console.log(`Processing ${fileName}`);
    fileUntility.splitRecords(contents, chunkSize, outputPath, fileExtension)
} else {
    if (process.argv.length < 5) {
        console.log('Must have 3 parameters for salt ')
        process.exit(1)
    }
    let saltsFile = '' + process.argv[3]
    let fileName = '' + process.argv[2]
    let outputFile = '' + process.argv[4]
    let salts = require('./' + saltsFile).salts
    let contents = fs.readFileSync(fileName, "utf8");
    let results = fileUntility.saltRecords(contents.split('\n'), salts)
    let output = ''
    for (record of results) {
        output = output + record + '\n'
    }
    fs.writeFileSync(outputFile, output)
}

// sample: node process-file.js split input-file output-path