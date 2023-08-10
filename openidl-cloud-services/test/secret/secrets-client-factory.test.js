const { expect } = require('chai');
const SecretsClientFactory = require('../../secret/secrets-client-factory');
const AWSSecretsManagerClient = require('../..//secret/aws-secrets-manager-client');
const AzureKeyVaultClient = require('../../secret/azure-key-vault-secrets-client');
const KubernetesClient = require('../../secret/kubernetes-secrets-client');
const cloudEnv = require('../../constants/cloud-env');


process.env['CLOUD_ENV'] = cloudEnv.AWS;
describe('AWS environment', () => {
    before(() => {
        process.env['CLOUD_ENV'] = cloudEnv.AWS;
    })
    after(() => {
        process.env['CLOUD_ENV'] = '';
    });
    it('should return the same AWSSecretsManagerClient instance for the same environment twice', async () => {
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient2).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('Azure environment', () => {
    before(() => {
        process.env['CLOUD_ENV'] = cloudEnv.AZURE;
    });

    after(() => {
        process.env['CLOUD_ENV'] = '';
    });

    it('should return the same AzureKeyVaultClient instance for the same environment twice', async () => {
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient2).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('Kubernetes environment', () => {
    before(() => {
        process.env['CLOUD_ENV'] = cloudEnv.KUBERNETES;
    });

    after(() => {
        process.env['CLOUD_ENV'] = '';
    });

    it('should return the same KubernetesClient instance for the same environment twice', async () => {
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient2).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

// Implement tests to check if SecretsClientFactory returns the correct client based on the CLOUD_ENV environment variable.