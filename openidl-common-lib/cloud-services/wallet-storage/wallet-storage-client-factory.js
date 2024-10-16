const HashicorpVaultClient = require('./hashicorp-vault-client');
const CouchDBWalletClient = require('./couchdb-wallet-client');
const walletStorageType = require('../constants/wallet-storage-type');

let instance = null;

class WalletStorageFactoryClient {
  /**
   * Creates an instance of a wallet storage client class based on the WALLET_STORAGE environment variable.
   *
   * @return {Promise<AbstractWalletStorageClient>} A Promise that resolves to an instance of the wallet storage class.
   */
  static async getInstance() {
    if (instance) {
      return instance;
    }

    const kvsConfig = JSON.parse(process.env.KVS_CONFIG);

    switch (kvsConfig.walletType) {
      case walletStorageType.VAULT:
        instance = await new HashicorpVaultClient().init();
        return instance;

      case walletStorageType.COUCHDB:
        instance = await new CouchDBWalletClient().init();
        return instance;

      default:
        throw new Error(
            `Invalid walletType! Must be one of ${Object.values(
                walletStorageType)}. Check walletType' in configurations.`);
    }
  }
}

module.exports = WalletStorageFactoryClient;
