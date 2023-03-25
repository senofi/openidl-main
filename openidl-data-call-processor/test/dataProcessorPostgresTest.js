const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const eventFunction =
	require('../server/controllers/event-function').eventFunction;
const dataProcessor = require('../server/controllers/data-processor-postgres');
const exPattern = require('../test/data/extractionPatternPayloadPostgres.json');
const extractionPatternAndDataCall = require('../test/data/GetDataCallAndExtractionPattern.json');
const processor = require('../server/controllers/processor');
const config = require('config');
const consentPayload = require('../test/data/processConsentPayload.json');
const listConsent = require('../test/data/listConsentByDataCallPayload.json');
const mongoRecords = require('../test/data/insuranceRecords_hartFort.json');
const extractionPatternPayload = require('../test/data/checkExtractionPatternPayload.json');
const sizeof = require('object-sizeof');
let exPayload = JSON.stringify(exPattern);
let consentPL = JSON.stringify(consentPayload);

process.env.KVS_CONFIG = '{}';
process.env['MAXIMUM_BATCH_SIZE_IN_BYTES'] = 300000;

class Transaction {
	transientTransaction(methodName, params) {
		return 'strategy success for mock transaction 81965e068cfe6d78e2bd078b2f0b49f428abeb4e20dede5381f71828b25214dd';
	}
	executeTransaction(methodName, params) {
		console.log('execute transaction');

		if (methodName == 'ListConsentsByDataCall') {
			return JSON.stringify(listConsent);
		} else if (methodName == 'CheckInsuranceDataExists') {
			return 'false';
		} else if (methodName == 'CheckExtractionPatternIsSet') {
			return JSON.stringify(extractionPatternPayload);
		} else if (methodName == 'GetDataCallAndExtractionPattern') {
			return JSON.stringify(extractionPatternAndDataCall);
		} else if (methodName == 'GetDataCallByIdAndVersion') {
			return JSON.stringify(extractionPatternAndDataCall);
		}
	}
	submitTransaction(transactionName, payload) {
		console.log(
			'> submit transaction: ' +
				transactionName +
				' - payload: ' +
				payload
		);
	}
	initWallet() {
		return true;
	}
	init(config) {
		console.log('Init channel config: ' + config);
	}
}

describe('Data call postgres processor extraction pattern event function test', () => {
	const localDbConfig = {
		postgres: {
			host: 'localhost',
			port: 5432,
			database: 'openidl-data-call-processor',
			username: 'postgres',
			password: 'postgres'
		},
		defaultDbType: 'mongo'
	};

	before(() => {
		sinon
			.stub(eventFunction, 'getChannelInstance')
			.returns(new Transaction());
		sinon
			.stub(eventFunction, 'getDefaultChannelTransaction')
			.returns(new Transaction());

		process.env['OFF_CHAIN_DB_CONFIG'] = JSON.stringify(localDbConfig);
	});
	after(() => {
		sinon.restore();
	});
	// it.only('it should send the extracted data from the extraction pattern', () => {
	//     eventFunction.ConsentedEvent(consentPL, "50001", new Transaction).then(function (result) {
	//         expect(result).to.equal(true);
	//     });
	// });
});

describe('Postgres processor calculation of maximum records count according to size limit ', () => {
	it('it should calculate records per page based on one record size', () => {
		const testDataProcessor = new dataProcessor(
			consentPayload.datacallID,
			consentPayload.dataCallVersion,
			consentPayload.carrierID,
			exPattern.extractionPattern,
			new Transaction(),
			'view'
		);
		const mockStringObject = JSON.stringify({ name: 'test' });
		const sizeOfMockObject = sizeof(mockStringObject);
		const recordsPerPage =
			testDataProcessor.calculateMaximumRecordsCountAccordingSizeLimit(
				mockStringObject
			);
		expect(recordsPerPage).to.equal(
			process.env['MAXIMUM_BATCH_SIZE_IN_BYTES'] / sizeOfMockObject
		);
	});
});

describe('Postgres processor page size based on one record', () => {
	after(() => {
		sinon.restore();
	});

	it('it should calculate records per page based on one record size', async () => {
		const testDataProcessor = new dataProcessor(
			consentPayload.datacallID,
			consentPayload.dataCallVersion,
			consentPayload.carrierID,
			exPattern.extractionPattern,
			new Transaction(),
			'view'
		);
		const mockCursor = {
			read: (count, callback) => {
				const records = mongoRecords.slice(0, count);
				callback(null, records);
			},
			close: () => {}
		};
		sinon
			.stub(testDataProcessor, 'executeExtractionPatternReduceWithCursor')
			.returns(
				new Promise((resolve, reject) => {
					resolve(mockCursor);
				})
			);
		const oneRowMongoRecords = mongoRecords.slice(0, 1);
		const inctanceObject = testDataProcessor.constructInstanceObject(
			1,
			consentPayload.datacallID,
			'v1',
			consentPayload.carrierID,
			oneRowMongoRecords
		);
		const sizeOfMockObject = sizeof(JSON.stringify(inctanceObject));
		const recordsPerPage = await testDataProcessor.getPageSize({}, {});
		expect(recordsPerPage).to.equal(
			Math.floor(
				process.env['MAXIMUM_BATCH_SIZE_IN_BYTES'] / sizeOfMockObject
			)
		);
	});
});

describe('Data call mongo processor event function test', () => {
	const transaction = new Transaction();
	const startProcessor2 = new dataProcessor(
		consentPayload.datacallID,
		consentPayload.dataCallVersion,
		consentPayload.carrierID,
		exPattern.extractionPattern,
		new Transaction(),
		'view'
	);
	before(() => {
		sinon
			.stub(eventFunction, 'getChannelInstance')
			.returns(new Transaction());
	});
	after(() => {
		sinon.restore();
	});
	it('it should save the processed document for process consent', () => {
		eventFunction
			.ConsentedEvent(consentPL, '50001', new Transaction())
			.then(function (result) {
				expect(result).to.equal(true);
			});
	});
});
