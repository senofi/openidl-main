const {Wallets} = require('fabric-network');
const config = require('config');
const AbstractWalletStorageClient = require('./abstract-wallet-storage-client')
const SecretsClientFactory = require('../secret/secrets-client-factory');

/**
 * This class defines an implementation of an Identity wallet that persists
 * to CouchDB
 *
 * @class
 * @extends {AbstractWalletStorageClient}
 */
class CouchDBWalletClient extends AbstractWalletStorageClient {
    /**
     * Creates an instance of CouchDBWalletStorage.
     */
    constructor() {
        super();
    }

    /**
     * Initialize and return an instance of CouchDBWalletStorage.
     *
     * @return {Promise<AbstractWalletStorageClient>} An instance of CouchDBWalletStorage.
     */
    async init() {
        const couchDbConfigSecretName = config.get('couchDbConfigSecretName');
        const secretsClient = await SecretsClientFactory.getInstance();
        const couchDbConfig = await secretsClient.getSecret(couchDbConfigSecretName);
        this.wallet = await Wallets.newCouchDBWallet(couchDbConfig.url);
        return this;
    }

    /**
     * Get a certificate or credential by label.
     *
     * @param {string} name The name for the certificate or credential.
     * @return {Promise<Object>} A Promise that resolves to the certificate or credential object.
     */
    async get(name) {
        return this.wallet.get(name);
    }

    /**
     * Put (store) a certificate or credential by name.
     *
     * @param {string} name The name for the certificate or credential.
     * @param {Object} identity The identity object to store.
     * @return {Promise<void>} A Promise that resolves when the operation is complete.
     */
    async put(name, identity) {
        await this.wallet.put(name, identity);
    }
}

module.exports = CouchDBWalletClient;
