const AWSSecretsManagerClient = require('./aws-secrets-manager-client');
const AzureKeyVaultClient = require('./azure-key-vault-secrets-client');
const KubernetesClient = require('./kubernetes-secrets-client');
const cloudEnv = require("../constants/cloud-env");
const S3BucketClient = require("../storage/s3bucket-client");
const AzureBlobClient = require("../storage/azureblob-client");

let instance = null;

/**
 * Factory class for creating a AbstractSecretsClient based on the environment configuration.
 */
class SecretsClientFactory {
    /**
     * Creates a AbstractSecretsClient based on the CLOUD_ENV environment variable.
     *
     * @returns {AbstractSecretsClient} The corresponding AbstractSecretsClient instance.
     * @throws {Error} Throws an error if the provider is not supported.
     */
    static getInstance() {
        if (instance) {
            return instance;
        }

        switch (process.env.CLOUD_ENV) {
            case cloudEnv.AWS:
                instance = new AWSSecretsManagerClient() // Provide necessary configuration
                return instance;
            case cloudEnv.AZURE:
                instance = new AzureKeyVaultClient();
                return instance;
            case cloudEnv.KUBERNETES:
                instance = new KubernetesClient();
                return instance;
            default:
                throw new Error(`Invalid CLOUD_ENV value. Must be one of ${Object.values(cloudEnv)}.`);
        }
    }
}

module.exports = SecretsClientFactory;
