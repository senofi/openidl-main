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
     * Retrieves objects by a specific prefix.
     *
     * @param {string} prefix - The prefix by which to search for objects.
     * @returns {Promise<Array.<object>>} - A promise that resolves to an array of objects representing the data.
     */
    async getObjectsByPrefix(prefix) {
        throw new Error('You have to implement the method getObjectsByPrefix!');
    }

    /**
     * Retrieves data object by a specific ID.
     *
     * @param {string} id - The identifier for the data object.
     * @returns {Promise<object>} - A promise that resolves to the data object.
     */
    async getObjectById(id) {
        throw new Error('You have to implement the method getObjectById!');
    }

    /**
     * Saves object.
     *
     * @param {string} id - The identifier for the data object.
     * @param {object} body - The data object to be saved.
     * @returns {Promise<object>} - A promise that resolves to the saved data object.
     */
    async saveObject(id, body) {
        throw new Error('You have to implement the method saveObject!');
    }

    /**
     * Uploads a stream to the file storage.
     *
     * @param {string} id - The identifier for the data.
     * @param {Stream} streamData - The data stream to be uploaded.
     * @returns {Promise<object>} - A promise indicating completion of the operation.
     */
    async uploadStream(id, streamData) {
        throw new Error('You have to implement the method uploadStream!');
    }

    /**
     * Deletes object with a specific ID.
     *
     * @param {string} id - The identifier for the data object.
     * @returns {Promise<void>} - A promise indicating completion of the operation.
     */
    async deleteObject(id) {
        throw new Error('You have to implement the method deleteObject!');
    }
}

module.exports = AbstractFileStorageClient;
