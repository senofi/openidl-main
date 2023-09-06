const FileStorageFactory = require(
  './file-storage/file-storage-client-factory',
);
const WalletStorageClientFactory = require(
  './wallet-storage/wallet-storage-client-factory',
);
const InsuranceDataStoreClientFactory = require(
  './insurance-data-store/insurance-data-store-client-factory',
);
const UserDataStoreClientFactory = require(
  './user-store/user-store-client-factory',
);

module.exports = {
  FileStorageFactory,
  WalletStorageClientFactory,
  InsuranceDataStoreClientFactory,
  UserDataStoreClientFactory,
};
