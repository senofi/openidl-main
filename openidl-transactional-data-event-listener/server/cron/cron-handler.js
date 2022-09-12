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
Transaction.initWallet(kvsConfig);
logger.debug(typeof kvsConfig)
logger.debug("kvs config: ", JSON.stringify(kvsConfig))
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
        logger.info("** Transaction completed for listMatureDataCalls at : End_Time= " + new Date().toISOString() + " result= " + JSON.stringify(queryResponse));

        //iterate over the results and emit events
        if (queryResponse.dataCallsList) {
            for (let i = 0; i < queryResponse.dataCallsList.length; i = i + 1) {
                logger.info("Found a mature data call!!!");
                em.emit('triggerEvent', queryResponse.dataCallsList[i]);
            }
        }

    } catch (error) {
        logger.error('processTransactionalDataAvailableEvent submit transaction  onerror:');
        logger.error(error);
    }
    return true;
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = CronHandler;