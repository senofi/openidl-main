const AWS = require('aws-sdk');
const AbstractSecretsClient = require('../abstract-secrets-client');
const getAccessParams = require('../../utils/awsAccessParams');
const {isEmpty} = require('lodash');

class AWSSecretsManagerClient extends AbstractSecretsClient {
  constructor() {
    super();
    this.awsConfig = JSON.parse(process.env.KVS_CONFIG) || {};

    if (isEmpty(this.awsConfig)) {
      throw new Error(
          'Missing AWS Secret manager configuration!');
    }
  }

  async _getClient() {
    if (this.client) {
      return this.client;
    }

    const accessParams = await getAccessParams(this.awsConfig);
    this.client = new AWS.SecretsManager(accessParams);
    return this.client;
  }

  async getSecret(name) {
    const client = await this._getClient()
    return client.getSecretValue({SecretId: name}).promise().then(
        data => JSON.parse(data.SecretString))
  }
}

module.exports = AWSSecretsManagerClient;