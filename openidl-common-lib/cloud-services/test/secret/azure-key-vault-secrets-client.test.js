const { expect } = require('chai');
const sinon = require('sinon');
const { SecretClient } = require('@azure/keyvault-secrets');
const config = require('config');
const AzureKeyVaultSecretsClient = require('../../secret/impl/azure-key-vault-secrets-client');

describe('AzureKeyVaultSecretsClient', () => {
    let configStub;
    let secretClientStub;
    beforeEach(() => {
        configStub = sinon.stub(config, 'get');
        secretClientStub = sinon.stub(SecretClient.prototype, 'getSecret').resolves({
            value: JSON.stringify({ key: 'value' })
        });

        process.env['KVS_CONFIG'] = JSON.stringify({
            azureTenantId: 'mockedTenantId',
            azureClientId: 'mockedClientId',
            azureClientSecret: 'mockedClientSecret',
            azureVaultUrl: 'mockedVaultUrl'
        });
    })
    afterEach(() => {
        configStub.restore();
        secretClientStub.restore();
    })
    it('should fetch and parse secret value', async () => {
        const azureKeyVaultSecretsClient = new AzureKeyVaultSecretsClient();
        const secret = await azureKeyVaultSecretsClient.getSecret('my-secret');

        expect(secret).to.deep.equal({ key: 'value' });
        expect(SecretClient.prototype.getSecret.called).to.be.true;
    });
});
