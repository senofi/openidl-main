const AWS = require('aws-sdk');
const config = require('config');
const AbstractSecretsClient = require('./abstract-secrets-client');
const getAccessParams = require('../utils/awsAccessParams');

class AWSSecretsManagerClient extends AbstractSecretsClient {
    constructor() {
        super();
    }

    async _getClient() {
        if (this.client) {
            return this.client;
        }

        const accessParams = await getAccessParams();
        this.client = new AWS.SecretsManager(accessParams);
        return this.client;
    }

    async getSecret(name) {
        const client = await this._getClient()
        return client.getSecretValue({SecretId: name}).promise().then(data => JSON.parse(data.SecretString))
    }
}

module.exports = AWSSecretsManagerClient;