const config = require('config');
const fileStoreType = require('../constants/file-store-type');
const S3BucketClient = require('./impl/s3bucket-client');
const AzureBlobClient = require('./impl/azureblob-client');

let instance = null;

class FileStorageClientFactory {
  /**
   * Returns an instance of the file storage client.
   * @returns {AbstractFileStorageClient} File storage client.
   */
  static getInstance() {
    if (instance) {
      return instance;
    }

    switch (config.get('fileStoreType')) {
      case  fileStoreType.S3:
        instance = new S3BucketClient();
        break;
      case fileStoreType.AZURE_BLOB:
        instance = new AzureBlobClient();
        break;
      default:
        throw new Error(
            `Invalid fileStoreType value. Must be one of ${Object.values(
                fileStoreType)}.`);
    }

    return instance;
  }

  static getS3Instance() {
    return new S3BucketClient();
  }

  static getAzureBlobInstance() {
    return new AzureBlobClient();
  }
}

module.exports = FileStorageClientFactory;