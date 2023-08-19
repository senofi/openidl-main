// mock value for KVS_CONFIG
process.env.KVS_CONFIG = '{}';

const chai = require('chai');
const expect = chai.expect;
const config = require('config');
const openidlCommonLib = require('openidl-common-lib');
const Transaction = openidlCommonLib.Transaction;
const EventListener = openidlCommonLib.EventListener
const eventFunction = require('../server/event/eventHandler').eventFunction;
const eventPayload = require('./test-data/event-payload.json');
const getInsuranceDataResponse = require(
    './test-data/insurance-data-response.json');
const payload = JSON.stringify(eventPayload);
const sinon = require("sinon");
const {TransactionalDataStorageClientFactory} = require(
    'openidl-common-lib/cloud-services');
let targetObject;

describe('TransactionalDataAvailable Event Test', () => {
  before(() => {
    const targetObject = {
      getTransactionalData: () => Promise.reject("error"),
      saveTransactionalData: () => Promise.resolve(
          "Records Inserted Successfully")
    };
    sinon.stub(TransactionalDataStorageClientFactory, 'getInstance').resolves(
        targetObject)

    sinon.stub(Transaction.prototype, 'executeTransaction').returns(
        JSON.stringify(getInsuranceDataResponse));
    sinon.stub(Transaction, 'initWallet').returns(true);
    sinon.stub(EventListener, 'getCarriersInstance').returns(
        new Transaction);
    console.log('this is target object', targetObject);
  });

  after(() => {
    sinon.restore();
  });

  it('should process TransactionalDataAvailable event ', () => {
    eventFunction.TransactionalDataAvailable(payload, "5000").then(
        function (result) {
          expect(result).to.equal(true);

        });
  });

});
