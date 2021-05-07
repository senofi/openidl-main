const chai = require('chai');
const expect = require('chai').expect;
const dataFileName = 'test/data/BatchDataInput.txt'
const fileUtility = require('../file-utility')
const testLossRecords = require('./data/testData').sampleBPFlatLossRecords
const testPremiumRecords = require('./data/testData').sampleBPFlatLossRecords
const fs = require('fs')

describe('Test the File Utility', () => {

    describe('Test the salter simply', () => {
        let salts = [(inputText) => { return 'b' }, (inputText) => { return inputText + '-x' }]
        it('Test salt record', () => {
            let result = fileUtility.saltRecord("a", salts)
            expect(result).to.equal('b-x')
        })

        it('Test multi record salter', () => {
            let results = fileUtility.saltRecords(["a", "b", "c"], salts)
            expect(results[0]).to.equal('b-x')
            expect(results[0]).to.equal('b-x')
            expect(results[0]).to.equal('b-x')
        })
    })

    describe('Test the salter with stat data', () => {

        let salts = [
            (inputRecord) => {
                let start = 169
                let end = 194
                let index = Math.floor(Math.random() * 3)
                let formEditions = ["BP 1234 0116             ", "BP 5678 0319             ", "BP 9012 0620             "]
                return inputRecord.substring(0, start) + formEditions[index] + inputRecord.substring(end)
            }]
        it('Test BP Loss Salting', () => {
            let i = 0
            do {
                console.log(Math.floor(Math.random(3) * 3))
                i++
            } while (i < 10)
            let results = fileUtility.saltRecords(testLossRecords, salts)
            console.log(testLossRecords)
            console.log(results)
            expect(results[0].substring(169, 194)).to.equal('0123456789012345678901234')
        })
    })

    describe('Test the csv splitter', () => {
        let directory = './test/output'
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
        let sampleData = 'a,b,c\n1,2,3\n2,3,4\n3,4,5\n4,5,6\n5,6,7\n6,7,8\n7,8,9\n9.9.10\n'
        let chunkSize = 2
        it('Test split csv content', () => {
            fileUtility.splitRecords(sampleData, chunkSize, './test/output/csv', 'csv')
            let fileCount = 0
            fs.readdir(directory, (err, files) => {
                fileCount = files.length
            })
        })
    })
})
