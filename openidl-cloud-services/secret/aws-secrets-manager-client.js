const AWS = require('aws-sdk');
const config = require('config');
const AbstractSecretsClient = require('./abstract-secrets-client');

class AWSSecretsManagerClient extends AbstractSecretsClient {
    constructor() {
        super();
    }

    static async _getAccessParams() {
        const sts = new AWS.STS({
            region: config.get('region'),
            accessKeyId: config.get('accessKeyId'),
            secretAccessKey: config.get('secretAccessKey')
        });
        const roleParams = config.get('roleParams');

        const accessParamInfo = await sts.assumeRole(roleParams).promise();

        return {
            accessKeyId: accessParamInfo.Credentials.AccessKeyId,
            secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
            sessionToken: accessParamInfo.Credentials.SessionToken,
            region: config.get('region')
        };
    }

    async _getClient() {
        if (this.client) {
            return this.client;
        }

        const accessParams = await AWSSecretsManagerClient._getAccessParams();
        this.client = new AWS.SecretsManager(accessParams);
        return this.client;
    }

    async getSecret(name) {
        const client = await this._getClient()
        return client.getSecretValue({SecretId: name}).promise().then(data => JSON.parse(data.SecretString))
    }
}

module.exports = AWSSecretsManagerClient;