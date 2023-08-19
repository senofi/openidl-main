const {ClientSecretCredential} = require("@azure/identity");
const {SecretClient} = require('@azure/keyvault-secrets');
const AbstractSecretsClient = require('../abstract-secrets-client');

class AzureKeyVaultSecretsClient extends AbstractSecretsClient {
  constructor() {
    super();
    this.azureConfig = JSON.parse(process.env.KVS_CONFIG) || {};

    if (isEmpty(this.azureConfig)) {
      throw new Error(
          'Missing Azure KeyVault Secrets Manager configuration!');
    }
    const credential = new ClientSecretCredential(
        this.azureConfig['azureTenantId'], this.azureConfig['azureClientId'],
        this.azureConfig['azureClientSecret']);
    this.client = new SecretClient(this.azureConfig['azureVaultUrl'],
        credential);
  }

  async getSecret(name) {
    const secret = await this.client.getSecret(name);
    return JSON.parse(secret.value);
  }
}

module.exports = AzureKeyVaultSecretsClient;