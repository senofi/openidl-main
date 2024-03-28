const MongoTransactionStorageClient = require(
    './impl/mongo-insurance-data-store-client');
const FileTransactionalDataStorageClient = require(
    './impl/file-insurance-data-store-client');
const insuranceDataStoreType = require(
    '../constants/insurance-data-store-type');
const config = require('config');

let instance = null;

class InsuranceDataStoreClientFactory {
  static INSURANCE_DATA_STORAGE_ENV_CONFIG_NAME = 'insuranceDataStorageEnv'

  /**
   * Returns an instance of the transactional data storage client.
   * @returns {AbstractInsuranceDataStoreClient} Transactional data storage client.
   */
  static async getInstance() {
    if (instance) {
      return instance;
    }

    switch (config.get(
        InsuranceDataStoreClientFactory.INSURANCE_DATA_STORAGE_ENV_CONFIG_NAME)) {
      case  insuranceDataStoreType.MONGO:
        instance = await new MongoTransactionStorageClient().init();
        break;
      case insuranceDataStoreType.S3_BUCKET:
        instance = await new FileTransactionalDataStorageClient().init();
        break;
      case insuranceDataStoreType.AZURE_BLOB:
        instance = await new FileTransactionalDataStorageClient().init();
        break;
      default:
        throw new Error(
            `Invalid insuranceDataStorageEnv value ${config.get(InsuranceDataStoreClientFactory.INSURANCE_DATA_STORAGE_ENV_CONFIG_NAME)}. Must be one of ${Object.values(
                insuranceDataStoreType)}.`);
    }

    return instance;
  }
}

module.exports = InsuranceDataStoreClientFactory;