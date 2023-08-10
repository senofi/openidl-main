const {expect} = require('chai');
const SecretsClientFactory = require('../../secret/secrets-client-factory');
const AWSSecretsManagerClient = require('../../secret/aws-secrets-manager-client');

describe('SecretsClientFactory getInstance returns AWS SecretManager', () => {
    before(() => {
        process.env['CLOUD_ENV'] =
            'AWS';
    })
    after(() => {
    })
    it('it should return AWS SecretManager client when CLOUD_ENV is AWS', async () => {
        const secretsClient = await SecretsClientFactory.getInstance();
        expect(secretsClient).to.be.an.instanceof(AWSSecretsManagerClient);
    });

});

// Implement tests to check if SecretsClientFactory returns the correct client based on the CLOUD_ENV environment variable.