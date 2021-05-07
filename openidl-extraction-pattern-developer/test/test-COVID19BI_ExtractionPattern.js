"use strict";
const fs = require('fs')
const ExtractionPatternManager = require('../service/extraction-pattern-manager')
const ExtractionPatternProcessor = require('../service/extraction-pattern-processor')
const MongoDBManager = require('../service/mongo-database-manager')
const chai = require('chai');
const expect = chai.expect;
const ep = require('./extractionPatterns/Covid19BI_DataCall_ExtractionPattern');
const { doesNotMatch } = require('assert');
const Parser = require('json2csv')
const { v4: uuidv4 } = require('uuid');


describe('Test Covid 19 Extraction Pattern against Mongo', function () {

  let dbName = 'openidl-offchain-db'
  let collectionName = 'insurance_trx_db_HIG'
  let reductionName = collectionName + '_' + 'covid_19' + '_1'
  var manager
  var processor
  var map
  var reduce
  var extractionPattern
  var dbManager
  before(async () => {
    manager = new ExtractionPatternManager()
    map = ep.map
    reduce = ep.reduce
    extractionPattern = manager.createExtractionPattern("COVID19BI_04", "COVID19BI_04", "COVID 19 BI Data Call Extraction Pattern", "OH", "Personal Lines", map, reduce, "0.1", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "kens@aaisonline.com")
    dbManager = initializeDBConnection()
    await dbManager.connect()
    await dbManager.useDatabase(dbName).catch((err) => { throw err })
  });
  describe('Run the COVID-19 Extraction Pattern against Mongo', () => {
    it('Create Extraction Pattern and save to output', async () => {
      const extractionPatternProcessor = new ExtractionPatternProcessor(dbManager, dbName, collectionName, reductionName)
      expect(extractionPattern).to.not.be.null;
      extractionPatternProcessor.processExtractionPattern(extractionPattern)
      console.log(extractionPattern)
      manager.writeExtractionPatternToFile(extractionPattern, 'COVID_19_BI_ExtractionPattern.json')
    });
  })
  describe('Test Export to CSV', async () => {
    it('export to csv', async () => {
      let reduced = await dbManager.getAllRecords(dbName, reductionName)
      let csv = convertToCSV(reduced)

      fs.writeFile('covid-output/covid-output-x.csv', csv, (err) => {
        if (err) {
          console.log('Error writing csv file: ' + err)
        }
      })

      expect(reduced.length).to.equal(77644)
    })
  })
});

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
  const fields = Object.keys(rows[0])
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

async function initializeDBConnection(local = true) {

  let url = local ? 'mongodb://localhost:27017' : 'mongodb://ibm_cloud_1fa04e1e_2f84_4dd1_80f7_799e0c8ab459:1a79f07de823b50b3ce44f6b543fa0b4f28f9bf9caba3e184acf36d9e29de2c6@f8225b83-0a41-4d73-bb9f-0b471ce6a3cb-0.btdkfu0w0p0vutjk0r9g.databases.appdomain.cloud:31377,f8225b83-0a41-4d73-bb9f-0b471ce6a3cb-1.btdkfu0w0p0vutjk0r9g.databases.appdomain.cloud:31377,f8225b83-0a41-4d73-bb9f-0b471ce6a3cb-2.btdkfu0w0p0vutjk0r9g.databases.appdomain.cloud:31377/ibmclouddb?authSource=admin&replicaSet=replset'
  return new MongoDBManager({ url: url })
}

const testData = require('./data/exported-from-mongodb/outputMongoJson.json')
const dbName = 'ks-test-01'
const collectionName = 'ks-collection'
const reductionName = 'ks-reduction'

describe('Test COVID Extraction Pattern against Sample Data', function () {

  let dbName = 'ks-ep-text'
  let collectionName = 'input-data'
  let reductionName = 'hds-report-input'

  var manager
  var processor
  var map
  var reduce
  var extractionPattern
  var dbManager
  before(async () => {
    manager = new ExtractionPatternManager()
    map = ep.map
    reduce = ep.reduce
    extractionPattern = manager.createExtractionPattern("COVID19BI_02", "COVID19BI_02", "COVID 19 BI Data Call Extraction Pattern", "AL", "Multiple Lines", map, reduce, "0.1", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "kens@aaisonline.com")
    dbManager = initializeDBConnection()
    await dbManager.connect()
    await dbManager.useDatabase(dbName).catch((err) => { throw err })
    await dbManager.dropCollection(collectionName).catch((err) => { throw err })
    await dbManager.loadData(testData, dbName, collectionName)

  });
  describe('Run the Extraction Pattern', () => {
    it('Create Extraction Pattern and save to output', async () => {
      const extractionPatternProcessor = new ExtractionPatternProcessor(dbManager, dbName, collectionName, reductionName)
      expect(extractionPattern).to.not.be.null;
      await extractionPatternProcessor.processExtractionPattern(extractionPattern)
      let records = await dbManager.getAllRecords(dbName, reductionName)
      expect(records.length).to.equal(22)
      console.log(extractionPattern)
      manager.writeExtractionPatternToFile(extractionPattern, 'COVID_19_BI_ExtractionPattern_01.json')
    });
  })

  describe('Test Export to CSV', async () => {
    it('export to csv', async () => {
      let reduced = await dbManager.getAllRecords(dbName, reductionName)
      let csv = convertToCSV(reduced)

      fs.writeFile('covid-output/covid-output-x.csv', csv, (err) => {
        if (err) {
          console.log('Error writing csv file: ' + err)
        }
      })

      expect(reduced.length).to.equal(223)
    })
  })

});

describe('Test Creating a CSV from the Extraction Pattern Results', function () {

  let dbName = 'openidl-offchain-db'
  let collectionName = 'insurance_trx_db_HIG'
  let reductionName = 'HIG_1a0996f0_a7d9_11eb_a457_c933ff94c683_1'

  var manager
  var processor
  var map
  var reduce
  var extractionPattern
  var dbManager
  before(async () => {
    manager = new ExtractionPatternManager()
    map = ep.map
    reduce = ep.reduce
    extractionPattern = manager.createExtractionPattern("COVID19BI_02", "COVID19BI_02", "COVID 19 BI Data Call Extraction Pattern", "AL", "Multiple Lines", map, reduce, "0.1", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "2022-01-30T18:30:00Z", "2023-01-30T18:30:00Z", "kens@aaisonline.com")
    dbManager = initializeDBConnection(false)
    await dbManager.connect()
    await dbManager.useDatabase(dbName).catch((err) => { throw err })

  });
  describe('Test Export to CSV of HIG Data', async () => {
    it('export to csv', async () => {
      console.log('export to csv')
      let reduced = await dbManager.getAllRecords(dbName, reductionName)
      let csv = convertToCSV(reduced)

      fs.writeFile('covid-output/covid-output-y.csv', csv, (err) => {
        if (err) {
          console.log('Error writing csv file: ' + err)
        }
      })

      expect(reduced.length).to.equal(22)
    })
  })

});