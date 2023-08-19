'use strict';

/**
 * An abstract wallet storage class to serve as the base for different storage clients for wallet for certificates and credentials.
 *
 * @class
 */
class AbstractWalletStorageClient {

    /**
     * Constructor.
     * @returns {Promise<AbstractWalletStorageClient>}
     */
    async init() {
        throw new Error('init method must be implemented in derived class');
    }

    /**
     * Abstract method to get a certificate or credential by label.
     *
     * @param {string} name The name for the certificate or credential.
     * @return {Promise<Object>} A Promise that resolves to the certificate or credential object.
     */
    async get(name) {
        throw new Error('get method must be implemented in derived class');
    }

    /**
     * Abstract method to put (store) a certificate or credential by name.
     *
     * @param {string} name The name for the certificate or credential.
     * @param {Object} identity The identity object to store.
     * @return {Promise<void>} A Promise that resolves when the operation is complete.
     */
    async put(name, identity) {
        throw new Error('put method must be implemented in derived class');
    }
}

module.exports = AbstractWalletStorageClient;
