const { expect } = require('chai');
const sinon = require('sinon');
const { SecretClient } = require('@azure/keyvault-secrets');
const config = require('config');
const AzureKeyVaultSecretsClient = require('../../cloud-services/secret/impl/azure-key-vault-secrets-client');

describe('AzureKeyVaultSecretsClient', () => {
    const configStub = sinon.stub(config, 'get');
    const secretClientStub = sinon.stub(SecretClient.prototype, 'getSecret').resolves({
        value: JSON.stringify({ key: 'value' })
     });
    beforeEach(() => {
        configStub.withArgs('azureTenantId').returns('mockedTenantId');
        configStub.withArgs('azureClientId').returns('mockedClientId');
        configStub.withArgs('azureClientSecret').returns('mockedClientSecret');
        configStub.withArgs('azureVaultUrl').returns('mockedVaultUrl');
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
