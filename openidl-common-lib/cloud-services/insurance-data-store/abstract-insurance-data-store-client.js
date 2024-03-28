class AbstractInsuranceDataStoreClient {
  constructor() {
    if (new.target === AbstractInsuranceDataStoreClient) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    if (this.init === undefined) {
      throw new TypeError("Must override method initConnection");
    }

    if (this.saveTransactionalData === undefined) {
      throw new TypeError("Must override method saveTransactionalData");
    }

    if (this.getTransactionalData === undefined) {
      throw new TypeError("Must override method getTransactionalData");
    }
  }

  /**
   * Initializes the database connection.
   *
   * @returns {Promise<any>} - A promise that resolves when the connection is initialized.
   */
  async init() {
    throw new Error("Must override method init");
  }

  /**
   * Saves transactional data to the database.
   *
   * @param {Object} input - The data to be saved.
   * @returns {Promise<any>} - A promise that resolves with the result of the save operation.
   */
  async saveTransactionalData(input) {
    throw new Error("Must override method saveTransactionalData");
  }

  /**
   * Retrieves transactional data from the database.
   *
   * @param {string} id - The ID of the data to be retrieved.
   * @returns {Promise<any>} - A promise that resolves with the retrieved data.
   */
  async getTransactionalData(id) {
    throw new Error("Must override method getTransactionalData");
  }

  /**
   * Retrieves transactional data from the database by id prefix.
   * @param prefix - The prefix of the data to be retrieved.
   * @returns {Promise<any>} - A promise that resolves with the retrieved data.
   */
  async getTransactionalDataByDataCall(prefix) {
    throw new Error("Must override method getTransactionalDataByDatacall");
  }

  /**
   * Uploads a stream.
   * @param id - The ID of the stream.
   * @param streamData - The stream data.
   * @returns {Promise<any>} - A promise that resolves with the result of the upload operation.
   */
  async uploadStream(id, streamData) {
    throw new Error("Must override method uploadStream");
  }
}

module.exports = AbstractInsuranceDataStoreClient;
