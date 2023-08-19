const { expect } = require('chai');
const sinon = require('sinon');
const AWSSecretsManagerClient = require('../../cloud-services/secret/impl/aws-secrets-manager-client');

describe('AWSSecretsManagerClient', () => {
    it('should fetch and parse secret value', async () => {
        const secretsManagerClient = new AWSSecretsManagerClient();
        const expectedSecretValue = { secretValue: 'secretValue' };

        const mockClient = sinon.stub(secretsManagerClient, '_getClient').returns({
            getSecretValue: () => {
                return {
                    promise: () => {
                        return Promise.resolve({ SecretString: JSON.stringify(expectedSecretValue) });
                    }
                };
            }
        });

        const mySecretId = 'my-secret-id';
        const secret = await secretsManagerClient.getSecret(mySecretId);

        expect(secret).to.deep.equal(expectedSecretValue);
        expect(secretsManagerClient._getClient.called).to.be.true;
    });
});
