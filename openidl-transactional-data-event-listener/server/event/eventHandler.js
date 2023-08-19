'use strict';

/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


const log4js = require('log4js');
const sizeof = require('object-sizeof');
const config = require('config');
const logger = log4js.getLogger('event -eventHandler ');
const {TransactionalDataStorageClientFactory} = require(
    'openidl-common-lib/cloud-services')
const {
  Transaction
} = require('openidl-common-lib');
const createTargetChannelTransactions = require(
    "../service/channelTransactionService");
logger.level = config.logLevel;
logger.info("Init wallet: " + process.env.KVS_CONFIG);

Transaction.initWallet(JSON.parse(process.env.KVS_CONFIG));
const ChannelTransactionMap = createTargetChannelTransactions();
let eventFunction = {};
// Changed event name to disable event listener
eventFunction.TransactionalDataAvailable = async function processTransactionalDataAvailableEvent(payload,
    blockNumber) {
  try {
    logger.info('processTransactionalDataAvailableEvent function entry');
    if (payload) {
      payload = JSON.parse(payload.toString('utf8'));
      logger.debug(' processTransactionalDataAvailableEvent block number ==>'
          + blockNumber, payload);
      // let pageSize = config.pageSize;
      let queryResponse;
      let data = {
        dataCallId: payload.dataCallId,
        dataCallVersion: payload.dataCallVersion,
        carrierId: payload.carrierId,
        channelName: payload.channelName,
        pageNumber: payload.pageNumber,
        sequenceNum: payload.sequenceNum
      };
      let CarrierChannelTransaction = ChannelTransactionMap.get(
          data.channelName);

      logger.debug('requset for ', data.dataCallId, data.dataCallVersion,
          data.carrierId, data.channelName);
      logger.debug(
          'processTransactionalDataAvailableEvent: GetInsuranceData submitTransaction invoke ');
      logger.info("** Transaction started for GetInsuranceData at : Start_Time="
          + new Date().toISOString());
      try {
        queryResponse = await CarrierChannelTransaction.executeTransaction(
            'GetInsuranceData', JSON.stringify(data), 3);
        queryResponse = JSON.parse(queryResponse.toString('utf8'))
      } catch (err) {
        logger.error('failed to get insurance data for ', data)
        logger.error('error during GetInsuranceDataByChannel inside onerror',
            err)
      }
      logger.debug(
          'processTransactionalDataAvailableEvent: GetInsuranceData submitTransaction complete for block '
          + blockNumber);
      logger.info(
          "** Transaction completed for GetInsuranceData at : End_Time= "
          + new Date().toISOString() + "Number of records= "
          + queryResponse.records.length + " Size of records= " + sizeof(
              queryResponse));
      logger.debug('processTransactionalDataAvailableEvent: iteration for ',
          data)

      let targetObject = await TransactionalDataStorageClientFactory.getInstance();

      let insuranceData = {};
      let id = data.dataCallId + '/' + data.carrierId + '-'
          + data.dataCallVersion + '-' + data.pageNumber + '-'
          + data.sequenceNum + '.json';
      logger.info("created id is: ", id)
      //check whether record already exist with this '_id'
      //then get '_rev '
      try {
        let revId = await targetObject.getTransactionalData(id);
        if (revId !== "error") {
          logger.debug('revId' + revId)
          insuranceData._rev = revId;
        }
      } catch (err) {
        logger.error('error during getTransactionalData onerror ' + err)
      }
      insuranceData._id = id;
      insuranceData.records = {
        records: queryResponse.records,
        recordsNum: payload.recordsNum
      };
      try {
        await targetObject.saveTransactionalData(insuranceData);
      } catch (err) {
        logger.error('failed to save transactional data for', insuranceData._id)
        logger.error('error during saveTransactionalData onerror ' + err)
      }
      logger.debug('transactional data saved for id', insuranceData._id)
    }
  } catch (error) {
    logger.error(
        'processTransactionalDataAvailableEvent submit transaction  onerror: for block '
        + blockNumber);
    logger.error(error);
  }
  return true;
}
module.exports.eventFunction = eventFunction;
