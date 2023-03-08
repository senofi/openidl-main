// mock value for KVS_CONFIG
process.env.KVS_CONFIG = '{}';

const chai = require('chai');
const expect = chai.expect;
const config = require('config');
const openidlCommonLib = require('@senofi/openidl-common-lib');
const Transaction = openidlCommonLib.Transaction;
const eventHandler = openidlCommonLib.eventHandler
const eventFunction = require('../server/event/eventHandler').eventFunction;
const InstanceFactory = require('../server/middleware/instance-factory');
//const CloudantManager = require('../server/middleware/cloudantManager');
const eventPayload = require('./test-data/event-payload.json');
const getInsuranceDataResponse = require('./test-data/insurance-data-response.json');
const payload = JSON.stringify(eventPayload);
const sinon = require("sinon");
const factoryObject = new InstanceFactory();
let targetObject;


describe('TransactionalDataAvailable Event Test', () => {
    before(() => {
        factoryObject.getInstance(config.insuranceDataStorageEnv).then(function (res) {
            targetObject = res;
            sinon.stub(Transaction.prototype, 'executeTransaction').returns(JSON.stringify(getInsuranceDataResponse));
            sinon.stub(Transaction, 'initWallet').returns(true);
            sinon.stub(eventHandler, 'getCarriersInstance').returns(new Transaction);
            console.log('this is target object', targetObject);
            sinon.stub(targetObject, 'getTransactionalData').rejects("error");
            sinon.stub(targetObject, 'saveTransactionalData').resolves("Records Inserted Successfully");
        })
    });

    after(() => {
        sinon.restore();
    });

    it('should process TransactionalDataAvailable event ', () => {
        eventFunction.TransactionalDataAvailable(payload, "5000").then(function (result) {
            expect(result).to.equal(true);

        });

    });

});
