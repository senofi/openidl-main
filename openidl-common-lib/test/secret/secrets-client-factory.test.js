const {expect} = require('chai');
const sinon = require('sinon');
const config = require('config');
const AWSSecretsManagerClient = require('../../cloud-services/secret/impl/aws-secrets-manager-client');
const AzureKeyVaultClient = require('../../cloud-services/secret/impl/azure-key-vault-secrets-client');
const KubernetesClient = require('../../cloud-services/secret/impl/kubernetes-secrets-client');
const cloudEnv = require('../../constants/cloud-env');

describe('SecretsClientFactory resolving secrets client AWS environment', () => {
    before(() => {
        process.env['CLOUD_ENV'] = cloudEnv.AWS;
    })
    after(() => {
        process.env['CLOUD_ENV'] = '';
        delete require.cache[require.resolve('../../secret/secrets-client-factory')];
    });
    it('should return the same AWSSecretsManagerClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient2).to.be.an.instanceof(AWSSecretsManagerClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('SecretsClientFactory resolving secrets client Azure environment', () => {
    before(() => {
        sinon.stub(config, 'get').returns('test');
        process.env['CLOUD_ENV'] = cloudEnv.AZURE;
    });

    after(() => {
        process.env['CLOUD_ENV'] = '';
        sinon.restore();
        delete require.cache[require.resolve('../../secret/secrets-client-factory')];
    });

    it('should return the same AzureKeyVaultClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient2).to.be.an.instanceof(AzureKeyVaultClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});

describe('SecretsClientFactory resolving secrets client Kubernetes environment', () => {
    before(() => {
        process.env['CLOUD_ENV'] = cloudEnv.KUBERNETES;
    });

    after(() => {
        process.env['CLOUD_ENV'] = '';
        delete require.cache[require.resolve('../../secret/secrets-client-factory')];
    });

    it('should return the same KubernetesClient instance for the same environment twice', async () => {
        const SecretsClientFactory = require('../../cloud-services/secret/secrets-client-factory');
        const secretsClient1 = SecretsClientFactory.getInstance();
        const secretsClient2 = SecretsClientFactory.getInstance();

        expect(secretsClient1).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient2).to.be.an.instanceof(KubernetesClient);
        expect(secretsClient1).to.equal(secretsClient2);
    });
});
