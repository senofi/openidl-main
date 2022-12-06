const chai = require('chai');
const expect = chai.expect;
const sinon = require("sinon");
const eventFunction = require("../server/controllers/event-function").eventFunction;
const dataProcessor = require("../server/controllers/data-processor-postgres");
const exPattern = require("../test/data/extractionPatternPayloadPostgres.json");
const extractionPatternAndDataCall = require("../test/data/GetDataCallAndExtractionPattern.json");
const processor = require("../server/controllers/processor");
const config = require('config');
const consentPayload = require("../test/data/processConsentPayload.json");
const listConsent = require("../test/data/listConsentByDataCallPayload.json");
const mongoRecords = require("../test/data/insuranceRecords_hartFort.json");
const extractionPatternPayload = require("../test/data/checkExtractionPatternPayload.json");
let exPayload = JSON.stringify(exPattern);
let consentPL = JSON.stringify(consentPayload);

process.env.KVS_CONFIG = '{}';

class Transaction {
    transientTransaction(methodName, params) {
        return "strategy success for mock transaction 81965e068cfe6d78e2bd078b2f0b49f428abeb4e20dede5381f71828b25214dd"
    }
    executeTransaction(methodName, params) {
        console.log("execute transaction")

        if (methodName == 'ListConsentsByDataCall') {
            return JSON.stringify(listConsent);
        } else if (methodName == 'CheckInsuranceDataExists') {
            return "false";
        } else if (methodName == 'CheckExtractionPatternIsSet') {
            return JSON.stringify(extractionPatternPayload);
        } else if (methodName == 'GetDataCallAndExtractionPattern') {
            return JSON.stringify(extractionPatternAndDataCall);
        } else if (methodName == 'GetDataCallByIdAndVersion') {
            return JSON.stringify(extractionPatternAndDataCall);
        }
    }
    submitTransaction(transactionName, payload) {
        console.log("> submit transaction: " + transactionName + " - payload: " + payload);
    }
    initWallet() {
        return true;
    }
    init(config) {
        console.log("Init channel config: " + config);
    }
}

describe('Data call postgres processor extraction pattern event function test', () => {

    const localDbConfig = {
        postgres: {
            host: 'localhost',
            port: 5432,
            database: 'testdb',
            username: 'postgres',
            password: 'mysecretpassword',
        },
        defaultDbType: 'mongo'
    };

    before(() => {
        sinon.stub(eventFunction, 'getChannelInstance').returns(new Transaction());
        sinon.stub(eventFunction, 'getDefaultChannelTransaction').returns(new Transaction());

        process.env['OFF_CHAIN_DB_CONFIG'] =
            JSON.stringify(localDbConfig);

    })
    after(() => {
        sinon.restore();
    })
    it.only('it should send the extracted data from the extraction pattern', () => {
        eventFunction.ConsentedEvent(consentPL, "50001", new Transaction).then(function (result) {
            expect(result).to.equal(true);
        });
    });

});

describe('Data call mongo processor event function test', () => {
    const transaction = new Transaction();
    const startProcessor2 = new dataProcessor(consentPayload.datacallID, consentPayload.dataCallVersion, consentPayload.carrierID, exPattern.extractionPattern, new Transaction, 'view');
    before(() => {
        sinon.stub(eventFunction, 'getChannelInstance').returns(new Transaction);
    })
    after(() => {
        sinon.restore();
    })
    it('it should save the processed document for process consent', () => {
        eventFunction.ConsentedEvent(consentPL, "50001", new Transaction).then(function (result) {
            expect(result).to.equal(true);
        });
    });
});