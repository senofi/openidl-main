/**
 * Abstract class representing a client for fetching secrets.
 * Subclasses must implement the getSecret method.
 */
class AbstractSecretsClient {
    /**
     * Fetches a secret by its name.
     *
     * @param {string} name - The name of the secret to fetch.
     * @returns {Promise<Object>} A promise that resolves to the secret value.
     * @throws {Error} Throws an error if the method is not implemented by a subclass.
     */
    getSecret(name) {
        throw new Error('You have to implement the method getSecret!');
    }
}

module.exports = AbstractSecretsClient;