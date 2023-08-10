const {ClientSecretCredential} = require("@azure/identity");
const {SecretClient} = require('@azure/keyvault-secrets');
const config = require('config');
const AbstractSecretsClient = require('./abstract-secrets-client');


class AzureKeyVaultSecretsClient extends AbstractSecretsClient {
    constructor() {
        super();
        const credential = new ClientSecretCredential(config.get('azureTenantId'), config.get('azureClientId'), config.get('azureClientSecret'));
        this.client = new SecretClient(config.get('azureVaultUrl'), credential);
    }

    async getSecret(name) {
        const secret = await this.client.getSecret(name);
        return JSON.parse(secret.value);
    }
}

module.exports = AzureKeyVaultSecretsClient;