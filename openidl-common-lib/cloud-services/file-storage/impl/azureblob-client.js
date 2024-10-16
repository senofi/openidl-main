const {BlobServiceClient, StorageSharedKeyCredential} = require(
    '@azure/storage-blob');
const log4js = require('log4js');
const config = require('config');
const {isEmpty} = require('lodash');
const AbstractFileStorageClient = require('../abstract-file-storage-client');

// Set up logging
const logger = log4js.getLogger('azureblob-client');
logger.level = config.logLevel;

class AzureBlobClient extends AbstractFileStorageClient {
  constructor() {
    super();
    this.azureBlobConfig = JSON.parse(process.env.AZURE_BLOB_CONFIG) || {};
    if (isEmpty(this.azureBlobConfig)) {
      throw new Error(
          'Missing Azure Blob configuration!');
    }
    this.containerName = this.azureBlobConfig['containerName'];
    const sharedKeyCredential = new StorageSharedKeyCredential(
        this.azureBlobConfig['accountName'],
        this.azureBlobConfig['accountKey']);
    this.blobServiceClient = new BlobServiceClient(
        this.azureBlobConfig['blobServiceUrl'],
        sharedKeyCredential
    );
  }

  async _getContainerClient(containerName) {
    return this.blobServiceClient.getContainerClient(containerName);
  }

  async _streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
  }

  async getObjectsByPrefix(prefix) {
    const containerClient = await this._getContainerClient(this.containerName);
    try {
      let result = [];
      for await (const blob of
          containerClient.listBlobsFlat({prefix: `${prefix}`})) {
        result.push(blob);
      }
      return Promise.resolve(result);
    } catch (err) {
      logger.error(err);
      return Promise.reject(err)
    }
  }

  async getObjectById(id) {
    const containerClient = await this._getContainerClient(this.containerName);
    const blobClient = containerClient.getBlobClient(id);

    try {
      const response = await blobClient.download();
      const buffer = await this._streamToBuffer(response.readableStreamBody);
      return JSON.parse(buffer.toString());
    } catch (err) {
      logger.error(err);
      return Promise.reject(err);
    }
  }

  async saveObject(id, body) {
    const containerClient = await this._getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(id);

    try {
      await blockBlobClient.upload(JSON.stringify(body), body.length);
    } catch (err) {
      logger.error(err);
      return Promise.reject(err);
    }
  }

  async uploadStream(id, streamData) {
    const containerClient = await this._getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(id);

    try {
      await blockBlobClient.uploadStream(streamData);
    } catch (err) {
      logger.error(err);
      return Promise.reject(err);
    }
  }

  async deleteObject(id) {
    const containerClient = await this._getContainerClient(this.containerName);
    const blobClient = containerClient.getBlobClient(id);

    try {
      await blobClient.deleteIfExists();
    } catch (err) {
      logger.error(err);
      return Promise.reject(err);
    }
  }
}

module.exports = AzureBlobClient;
