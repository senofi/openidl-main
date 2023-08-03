const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const log4js = require('log4js');
const config = require('config');
const blobConfig = require('../config/azure-blob-config.json');
const AbstractFileStorageClient = require('./abstract-file-storage-client');

// Example config json
// {
//     "accountName": "<your_account_name>",
//     "accountKey": "<your_account_key>",
//     "blobServiceUrl": "https://<your_account_name>.blob.core.windows.net",
//     "containerName": "<your_container_name>"
// }

// Set up logging
const logger = log4js.getLogger('azureblob-manager');
logger.level = config.logLevel;

const sharedKeyCredential = new StorageSharedKeyCredential(blobConfig.accountName, blobConfig.accountKey);

class AzureBlobClient extends AbstractFileStorageClient {
    constructor() {
        super();
        this.blobServiceClient = new BlobServiceClient(
            blobConfig.blobServiceUrl,
            sharedKeyCredential
        );
    }

    async getContainerClient(containerName) {
        return this.blobServiceClient.getContainerClient(containerName);
    }

    async getTransactionalDataByDatacall(dataCallId) {
        logger.info("Inside getTransactionalDataByDataCall, datacallId is ", dataCallId);
        const containerClient = await this.getContainerClient(blobConfig.containerName);

        try {
            let result = [];
            for await (const blob of containerClient.findBlobsByHierarchy('/', { prefix: dataCallId })) {
                result.push(blob);
            }
            return result;
        } catch (err) {
            logger.error(err);
        }
    }

    async getData(id) {
        logger.info("Inside getData, id is ", id);
        const containerClient = await this.getContainerClient(blobConfig.containerName);
        const blobClient = containerClient.getBlobClient(id);

        try {
            const data = await blobClient.download();
            return data;
        } catch (err) {
            logger.error(err);
        }
    }

    async saveTransactionalData(input) {
        logger.debug('Inside saveTransactionalData');
        const containerClient = await this.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(input._id);

        try {
            await blockBlobClient.upload(JSON.stringify(input.records), input.records.length);
            logger.debug('Records Inserted Successfully');
        } catch (err) {
            logger.error(err);
        }
    }

    async uploadStreamToBlob(input, streamData) {
        logger.debug('Inside uploadStreamToBlob');
        const containerClient = await this.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(input);

        try {
            await blockBlobClient.uploadStream(streamData);
            logger.debug('Records Inserted Successfully');
        } catch (err) {
            logger.error(err);
        }
    }
}

module.exports = AzureBlobClient;
