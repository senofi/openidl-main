const FileStorageFactory = require(
    './file-storage/file-storage-client-factory');
const WalletStorageClientFactory = require(
    './wallet-storage/wallet-storage-client-factory');
const TransactionalDataStorageClientFactory = require(
    './insurance-data-store/insurance-data-store-client-factory');

module.exports = {
  FileStorageFactory,
  WalletStorageClientFactory,
  TransactionalDataStorageClientFactory
}