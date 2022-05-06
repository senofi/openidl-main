'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('cron');
const { EventEmitter } = require("events");
const em = new EventEmitter();
const matureEventHandler = require('../matureEvent/matureEvent');

const CronHandler = {};
CronHandler.init = () => {
	em.on('triggerEvent', matureEventHandler.handleMatureEvent);
}
CronHandler.pollForMaturedDataCall = async () => {
    logger.info("Inside Cron Handler");
	em.emit('triggerEvent');
    try {

        // logger.info('cron handler function entry');
        //     let queryResponse;
        //     let CarrierChannelTransaction = ChannelTransactionMap.get(data.channelName);

        //     logger.info("** Transaction started for ListDataCallsByCriteria at : Start_Time=" + new Date().toISOString());
        //     try {
        //         queryResponse = await CarrierChannelTransaction.executeTransaction('ListDataCallsByCriteria', JSON.stringify(data));
        //         queryResponse = JSON.parse(queryResponse.toString('utf8'))
        //     } catch (err) {
        //         logger.error('failed to get datacall data for ', data)
        //         logger.error('error during ListDataCallsByCriteria inside onerror ', err)
        //     }
        //     logger.debug('pollForMaturedDataCall: ListDataCallsByCriteria submitTransaction complete ');
        //     logger.info("** Transaction completed for GetInsuranceData at : End_Time= " + new Date().toISOString() + "Number of records= " + queryResponse.records.length + " Size of records= " + sizeof(queryResponse));

	//     //iterate over the results and emit events
	//     for (const i = 0; i < queryResponse.length; i = i+1) {
	// 	var end = new Date();
	// 	end.setHours(0,0,0,0);
	// 	var start = new Date();
	// 	start.setDate(end.getDate() - 1); // Yesterday!
	// 	start.setHours(0,0,0,0);
	// 	    if (queryResponse[i].deadline >= start && queryResponse[i].deadline < end) {
        //               //emit event

	// 	    }
	//     }

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