const config = require('config');
const AbstractTransactionalDataStorageClient = require(
    '../abstract-insurance-data-store-client');
const FileStorageClientFactory = require(
    '../../file-storage/file-storage-client-factory');
const InsuranceDataStoreClientFactory = require(
    '../insurance-data-store-client-factory');
const insuranceDataStoreType = require(
    '../../constants/insurance-data-store-type');

class FileInsuranceDataStoreClient extends AbstractTransactionalDataStorageClient {
  constructor() {
    super()
  }

  async init() {
    switch (config.get(
        InsuranceDataStoreClientFactory.INSURANCE_DATA_STORAGE_ENV_CONFIG_NAME)) {
      case  insuranceDataStoreType.S3_BUCKET:
        this.client = FileStorageClientFactory.getS3Instance();
        break;
      case insuranceDataStoreType.AZURE_BLOB:
        this.client = FileStorageClientFactory.getAzureBlobInstance();
        break;
      default:
        throw new Error(
            `Invalid insuranceDataStorageEnv value. Must be one of ${Object.values(
                insuranceDataStoreType)}.`);
    }
    return this;
  }

  async saveTransactionalData(input) {
    return this.client.saveObject(input._id, input);
  }

  async getTransactionalData(id) {
    return this.client.getObjectById(id);
  }

  async getTransactionalDataByDataCall(prefix) {
    return this.client.getObjectsByPrefix(prefix);
  }

  async uploadStream(id, streamData) {
    return this.client.uploadStream(id, streamData);
  }
}

module.exports = FileInsuranceDataStoreClient;