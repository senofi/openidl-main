
let InstanceFactory = require('../middleware/instance-factory');
const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('event -eventHandler ');
const MatureEvent = {}
MatureEvent.handleMatureEvent = async (data) => {
	logger.info("in handleMatureEvent", data)
	//creating instance factory object 
	let factoryObject = new InstanceFactory();
	logger.info("config storage env ", config.insuranceDataStorageEnv)
	let targetObject = await factoryObject.getInstance(config.insuranceDataStorageEnv);
	logger.info("targetObject: ", typeof targetObject)
	logger.info("Gathering all results");
	let allInsuranceData = await targetObject.getTransactionalDataByDatacall(data.dataCalls.id);
	logger.info("all insurance data fetched.");
	if (allInsuranceData.Contents.length === 0) {
		logger.error("Mature data call has no consent!")
	} else {
		let resultSet = [];
		let totalRecords = 0;
		for (let j = 0; j < allInsuranceData.Contents.length; j = j + 1) {
			const data = await targetObject.getData(allInsuranceData.Contents[j].Key)
			const parsedData = JSON.parse(data.Body);
			resultSet = resultSet.concat(parsedData.records);
			totalRecords += parsedData.recordsNum
		}
		if(totalRecords != resultSet.length){
			throw new Error('Error occured while combining data chunks');
		}
		let id = 'result' + '-' + data.dataCalls.id;
		var resultData = new Object();
		resultData._id = id;
		resultData.records = JSON.stringify(resultSet);
		try {
			await targetObject.saveTransactionalData(resultData);
			//test for if result is saved
			const readResult = await targetObject.getData(id)
		} catch (err) {
			logger.error('failed to save result data for', resultData._id)
			logger.error('error during save resultlData onerror ' + err)
		}
		logger.debug('result data saved for id', resultData._id)
	}
}


module.exports = MatureEvent;
