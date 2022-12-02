const log4js = require('log4js');
const config = require('../config/default.json');
const logger = log4js.getLogger('data-processor-postgres');
logger.level = config.logLevel;
const sleep = require('sleep');
const sizeof = require('object-sizeof');
import { DBManagerFactory } from '@senofi/openidl-common-lib';

let InstanceFactory = require('../middleware/instance-factory');

let emailService = openidlCommonLib.Email;
const emailkey = require('../config/default.json').send_grid_apikey;
const emailData = require('../config/email.json').Config;

// Venkat Jira 104
let pdcFailureStatus;
let S3FailureStatus;
let transferDocuments

class DataProcessorMongo {
    constructor(id, version, carrierID, exPattern, channel, reduceCollectionName) {
        logger.debug(" In DataProcessorMongo ");
        logger.debug("carrierID  " + carrierID);
        this.dataCallId = id;
        this.dataCallVersion = version;
        this.carrierId = carrierID;
        this.extractionPattern = exPattern;
        this.skip = 0;
        this.pageNumber = 0;
        this.stopIteration = false;
        this.targetChannelTransaction = channel;
        this.reduceCollectionName = reduceCollectionName;
        this.start_Key = null;
        this.value = null;
        this.dbManager = null;
        this.createView = false;
    }

    async isView() {
        return this.createView;
    }

    async processRecords(reduceCollectionName, extractionPattern,
                         premiumFromDate,
                         premiumToDate,
                         lossFromDate,
                         lossToDate,
                         lineOfBusiness,
                         jurisdiction,
                         datacallID,
                         dataCallVersion) {

        let dbManager = await new DBManagerFactory().getInstance(JSON.parse(process.env.OFF_CHAIN_DB_CONFIG));

        const result = await dbManager.executeExtractionPattern(extractionPattern);

        try {
            await this.pushToPDC(this.carrierId, result.rows, 1, this.dataCallId, 'v1', this.targetChannelTransaction);
            await this.submitTransaction(this.dataCallId, "v1", this.carrierId);
        } catch (err) {

        }
    }

    async submitTransaction(datacallId, versionId, carrierId) {
        //  Update Consent status into Blockchain
        let payload = {
            dataCallID: datacallId,
            dataCallVersion: versionId,
            carrierID: carrierId,
            status: "Completed"
        }
        try {
            await this.targetChannelTransaction.submitTransaction('UpdateConsentStatus', JSON.stringify(payload));
        } catch (ex) {
            logger.error("Failed to update blockchain consent status as Completed")
        }

    }

    async pushToPDC(carrierId, records, pageNumber, datacallid, versionid, target) {
        try {
            let insuranceObject = {
                pageNumber: pageNumber,
                dataCallId: datacallid,
                dataCallVersion: versionid,
                carrierId: carrierId,
                records: records
            }
            logger.debug("insuranceObject " + JSON.stringify(insuranceObject))
            if (insuranceObject.records.length === 0) {
                logger.info('Insurance Records not available in Mongo Database');
            } else {
                let data = JSON.stringify(insuranceObject); // Convert transient data object to JSON string
                data = new Buffer(data).toString('base64'); // convert the JSON string to base64 encoded string
                let insurance_private = {
                    "transactional-data-": data
                };
                logger.info("Transaction before PDC :- Size of the payload = " + sizeof(insuranceObject) + "START_TIME = " + new Date().toISOString() + " Number of records : " + insuranceObject.records.length + "Page Number" + pageNumber);
                await target.transientTransaction('SaveInsuranceData', insurance_private, pageNumber);
                logger.info("Transaction after PDC :- END_TIME = " + new Date().toISOString() + "DATACALL_ID :- " + insuranceObject.dataCallId + "CARRIER_ID :- " + insuranceObject.carrierId + "Page Number" + pageNumber);
            }
        } catch (ex) {
            throw ex
        }

    }
}

module.exports = DataProcessorMongo;
