const {expect} = require('chai');
const AWSSecretsManagerClient = require('../../../cloud-services/secret/impl/aws-secrets-manager-client');
const AzureKeyVaultClient = require('../../../cloud-services/secret/impl/azure-key-vault-secrets-client');
const KubernetesClient = require('../../../cloud-services/secret/impl/kubernetes-secrets-client');
const secretsStoreType = require('../../../cloud-services/constants/secrets-store-type');

describe('SecretsClientFactory resolving secrets client AWS environment', () => {
    before(() => {
        process.env['KVS_CONFIG'] = JSON.stringify({ secretsStoreType: secretsStoreType.AWS_SECRETS_MANAGER });
    })
    after(() => {
        delete require.cache[require.resolve('../../../cloud-services/secret/secrets-client-factory')];
        process.env['KVS_CONFIG'] = JSON.stringify({})
    });
    it('should return the same AWSSecretsManagerClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient2).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('SecretsClientFactory resolving secrets client Azure environment', () => {
    before(() => {
        process.env['KVS_CONFIG'] = JSON.stringify({
            secretsStoreType: secretsStoreType.AZURE_KEY_VAULT,
            azureTenantId: 'mockedTenantId',
            azureClientId: 'mockedClientId',
            azureClientSecret: 'mockedClientSecret',
            azureVaultUrl: 'mockedVaultUrl'});
    })
    after(() => {
        delete require.cache[require.resolve('../../../cloud-services/secret/secrets-client-factory')];
        process.env['KVS_CONFIG'] = JSON.stringify({})
    });

    it('should return the same AzureKeyVaultClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient2).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('SecretsClientFactory resolving secrets client Kubernetes environment', () => {
    before(() => {
        process.env['KVS_CONFIG'] = JSON.stringify({ secretsStoreType: secretsStoreType.KUBERNETES_SECRETS });
    });

    after(() => {
        delete require.cache[require.resolve('../../../cloud-services/secret/secrets-client-factory')];
        process.env['KVS_CONFIG'] = JSON.stringify({})
    });

    it('should return the same KubernetesClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient2).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});
