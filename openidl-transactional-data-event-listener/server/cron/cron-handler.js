'use strict';
const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('cron');
const { EventEmitter } = require("events");
const em = new EventEmitter();
const matureEventHandler = require('../matureEvent/matureEvent');
logger.level = config.logLevel;

const targetChannelConfig = require('../config/target-channel-config');
const kvsConfig = require('../config/local-kvs-config.json');
const networkConfig = require('../config/connection-profile.json');
const {
    Transaction
} = require('@openidl-org/openidl-common-lib');
let ChannelTransactionMap = new Map();
logger.level = config.logLevel;
logger.warn("kvs config: ", process.env.KVS_CONFIG)
Transaction.initWallet(kvsConfig);
for (let channelIndex = 0; channelIndex < targetChannelConfig.targetChannels.length; channelIndex++) {
    const targetChannelTransaction = new Transaction(targetChannelConfig.users[0].org, targetChannelConfig.users[0].user, targetChannelConfig.targetChannels[channelIndex].channelName, targetChannelConfig.targetChannels[channelIndex].chaincodeName, targetChannelConfig.users[0].mspId);
    targetChannelTransaction.init(networkConfig);
    ChannelTransactionMap.set(targetChannelConfig.targetChannels[channelIndex].channelName, targetChannelTransaction);

}
const CronHandler = {};
CronHandler.init = () => {
	em.on('triggerEvent', (data) => {
		 matureEventHandler.handleMatureEvent(data);
		});
}
CronHandler.pollForMaturedDataCall = async () => {
    logger.info("Inside Cron Handler");
	// em.emit('triggerEvent', "testdata");
        logger.info('cron handler function entry');
    try {

            let queryResponse;
            let defaultChannelTransaction = ChannelTransactionMap.get("defaultchannel");

            logger.info("** Transaction started for ListDataCallsByCriteria at : Start_Time=" + new Date().toISOString());
            try {
                queryResponse = await defaultChannelTransaction.executeTransaction('ListMatureDataCalls');
                queryResponse = JSON.parse(queryResponse.toString('utf8'))
            } catch (err) {
                logger.error('failed to get mature datacalls ')
                logger.error('error during ListDataCallsByCriteria inside onerror ', err)
            }
            logger.debug('pollForMaturedDataCall: ListDataCallsByCriteria submitTransaction complete ');
            logger.info("** Transaction completed for GetInsuranceData at : End_Time= " + new Date().toISOString() +  " result= " + JSON.stringify(queryResponse));

	    //iterate over the results and emit events
	    for (const i = 0; i < queryResponse.length; i = i+1) {
		em.emit('triggerEvent', queryResponse[i]);
		// var end = new Date();
		// end.setHours(0,0,0,0);
		// var start = new Date();
		// start.setDate(end.getDate() - 1); // Yesterday!
		// start.setHours(0,0,0,0);
		//     if (queryResponse[i].deadline >= start && queryResponse[i].deadline < end) {
                //       //emit event

		//     }
	    }

    } catch (error) {
        logger.error('processTransactionalDataAvailableEvent submit transaction  onerror:' );
        logger.error(error);
    }
    return true;
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = CronHandler;