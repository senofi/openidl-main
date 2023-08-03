/**
 * AbstractFileStorageClient serves as an interface for implementing
 * file storage clients. It provides a common API for working
 * with different file storage services.
 */
class AbstractFileStorageClient {
    constructor() {
        if (this.constructor === AbstractFileStorageClient) {
            throw new TypeError('Abstract class "AbstractFileStorageClient" cannot be instantiated directly.');
        }
    }

    /**
     * Retrieves transactional data by a specific data call ID.
     *
     * @param {string} dataCallId - The identifier for the data call.
     * @returns {Promise<object[]>} - A promise that resolves to an array of objects representing the data.
     */
    async getTransactionalDataByDatacall(dataCallId) {
        throw new Error('You have to implement the method getTransactionalDataByDatacall!');
    }

    /**
     * Retrieves data by a specific ID.
     *
     * @param {string} id - The identifier for the data.
     * @returns {Promise<object>} - A promise that resolves to the data object.
     */
    async getData(id) {
        throw new Error('You have to implement the method getData!');
    }

    /**
     * Saves transactional data.
     *
     * @param {object} input - The data to be saved, including an identifier and records.
     * @returns {Promise<void>} - A promise indicating completion of the operation.
     */
    async saveTransactionalData(input) {
        throw new Error('You have to implement the method saveTransactionalData!');
    }

    /**
     * Uploads a stream to the file storage.
     *
     * @param {string} input - The identifier for the data.
     * @param {Stream} streamData - The data stream to be uploaded.
     * @returns {Promise<void>} - A promise indicating completion of the operation.
     */
    async uploadStream(input, streamData) {
        throw new Error('You have to implement the method uploadStream!');
    }
}

module.exports = AbstractFileStorageClient;
