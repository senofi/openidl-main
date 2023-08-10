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
        const storageType = process.env.WALLET_STORAGE;

        switch (storageType) {
            case walletStorageType.HASHICORP_VAULT:
                instance = await new HashicorpVaultClient().init();
                return instance;

            case walletStorageType.COUCHDB:
                instance = await new CouchDBWalletClient().init();
                return instance;

            default:
                throw new Error(`Invalid WALLET_STORAGE env variable value. Must be one of ${Object.values(walletStorageType)}.`);
        }
    }
}

module.exports = WalletStorageFactoryClient;
