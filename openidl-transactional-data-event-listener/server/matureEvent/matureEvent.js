
let InstanceFactory = require('../middleware/instance-factory');
const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('event -eventHandler ');
const Stream = require('stream');
const MatureEvent = {}
MatureEvent.handleMatureEvent = async (data) => {
	try {
		logger.info("in handleMatureEvent", data)
		//creating instance factory object 
		let factoryObject = new InstanceFactory();
		logger.debug("config storage env ", config.insuranceDataStorageEnv)
		let targetObject = await factoryObject.getInstance(config.insuranceDataStorageEnv);
		logger.debug("targetObject: ", typeof targetObject)
		logger.info("Gathering all results");
		let allInsuranceData = await targetObject.getTransactionalDataByDatacall(data.dataCalls.id);
		logger.info("all insurance data fetched.");
		if (allInsuranceData.Contents.length === 0) {
			logger.error("Mature data call has no consent!")
		} else {
			const stream = new Stream.PassThrough();
			let totalRecords = 0, recordsCount = 0;
			for (let j = 0; j < allInsuranceData.Contents.length; j = j + 1) {
				const data = await targetObject.getData(allInsuranceData.Contents[j].Key)
				const parsedData = JSON.parse(data.Body);
				const stringifiedRecords = JSON.stringify(parsedData.records);
				if (allInsuranceData.Contents.length == 1) {
					stream.write(stringifiedRecords);
				} else if (j == 0) {
					stream.write(stringifiedRecords.substring(0, stringifiedRecords.length - 1));
				}

				if (j > 0) {
					if (allInsuranceData.Contents.length - 1 != j) {
						stream.write(',');
						stream.write(stringifiedRecords.substring(1, stringifiedRecords.length - 1));
					} else {
						stream.write(',');
						stream.write(stringifiedRecords.substring(1, stringifiedRecords.length));
					}
				}
				totalRecords += parsedData.recordsNum
				recordsCount += parsedData.records.length;
			}
			stream.end();
			if (totalRecords != recordsCount) {
				throw new Error('Error occured while combining data chunks for data call with id: ' + data.dataCalls.id);
			}
			let id = 'result' + '-' + data.dataCalls.id;
			try {
				await targetObject.uploadStreamToS3(id, stream);
			} catch (err) {
				logger.error('failed to save result data for ', id)
				logger.error('error during save resultlData onerror ' + err)
			}
			logger.debug('result data saved for id', id)
		}
	} catch (error) {
		logger.error(error);
	}
}


module.exports = MatureEvent;
