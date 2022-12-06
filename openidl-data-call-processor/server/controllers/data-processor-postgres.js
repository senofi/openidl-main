const log4js = require('log4js');
const config = require('../config/default.json');
const logger = log4js.getLogger('data-processor-postgres');
logger.level = config.logLevel;
const sizeof = require('object-sizeof');
const { DBManagerFactory } = require('@senofi/openidl-common-lib');

let InstanceFactory = require('../middleware/instance-factory');

class DataProcessorPostgres {
    constructor(id, version, carrierID, exPattern, channel, reduceCollectionName) {
        logger.debug("In DataProcessorPostgres - carrierID: {} ", carrierID);
        this.dataCallId = id;
        this.dataCallVersion = version;
        this.carrierId = carrierID;
        this.extractionPattern = exPattern;
        this.skip = 0;
        this.pageNumber = 0;
        this.targetChannelTransaction = channel;
        this.reduceCollectionName = reduceCollectionName;
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

        logger.info('Process records (postgres)')
        const options = JSON.parse(process.env.OFF_CHAIN_DB_CONFIG);

        const dbManager = await new DBManagerFactory().getInstance(options, extractionPattern.dbType);
        logger.info('Db manager:', dbManager);

        const result = await dbManager.executeExtractionPattern(extractionPattern);
        logger.info(`Extraction result: ${result}`);
        try {
            await this.pushToPDC(this.carrierId, result.rows, 1, this.dataCallId, 'v1', this.targetChannelTransaction);
            await this.submitTransaction(this.dataCallId, "v1", this.carrierId);
        } catch (err) {
            logger.error("Error while saving data to PDC", err);
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
                logger.info('Insurance Records not available in SQL Database');
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

module.exports = DataProcessorPostgres;
