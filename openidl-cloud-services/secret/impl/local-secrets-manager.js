const {isEmpty} = require('lodash');
const AbstractSecretsClient = require('../abstract-secrets-client');

class LocalSecretsManager extends AbstractSecretsClient {
  constructor() {
    super();
    this.localSecrets = JSON.parse(process.env.KVS_CONFIG) || {};

    if (isEmpty(this.localSecrets)) {
      throw new Error(
          'No local secrets found! Have you provided local-kvs-config.json?');
    }
  }

  async getSecret(name) {
    return Promise.resolve(this.localSecrets[name]);
  }
}

module.exports = LocalSecretsManager;