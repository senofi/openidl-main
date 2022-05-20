
let InstanceFactory = require('../middleware/instance-factory');
const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('event -eventHandler ');

const MatureEvent = {}

MatureEvent.handleMatureEvent = async (data) => {
	logger.info("in handleMatureEvent", data)
	//creating instance factory object 
	//(to use s3Bucket pass "s3Bucket" and for cloudant use "cloudant"
	let factoryObject = new InstanceFactory();
	let targetObject = await factoryObject.getInstance(config.insuranceDataStorageEnv);

	for (var i = 0; i <data.length; i = i+1 ) {
		let allInsuranceData = await targetObject.getTransactionalDataByDatacall(data[i].id);
		const resultSet = [];
		for (let j = 0; j < allInsuranceData.length; j = j+1) {
                       resultSet.push(allInsuranceData[j].records)
		}
		let id = 'result' + '-' + data[i].id;
		var resultData = new Object();
		resultData._id = id;
		resultData.records = resultSet;

		try {
			await targetObject.saveTransactionalData(resultData);
		} catch (err) {
			logger.error('failed to save result data for', resultData._id)
			logger.error('error during save resultlData onerror ' + err)
		}
		logger.debug('result data saved for id', resultData._id)

	}
	let id = data.dataCallId + '-' + "result";
	resultData._id = id;
	resultData.records = data;
	try {
	await targetObject.saveTransactionalData(resultData);
	logger.debug('transactional data saved for id', resultData._id)
	} catch (err) {
	logger.error('failed to save transactional data for', resultData._id)
	logger.error('error during saveTransactionalData onerror ' + err)
	}
}


module.exports = MatureEvent;