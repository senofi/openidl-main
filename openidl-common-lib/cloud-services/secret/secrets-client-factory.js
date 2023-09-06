const AWSSecretsManagerClient = require('./impl/aws-secrets-manager-client');
const AzureKeyVaultClient = require('./impl/azure-key-vault-secrets-client');
const KubernetesClient = require('./impl/kubernetes-secrets-client');
const LocalSecretsManager = require('./impl/local-secrets-manager');
const secretsStoreType = require("../constants/secrets-store-type");

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

    const kvsConfig = JSON.parse(process.env.KVS_CONFIG);

    switch (kvsConfig.secretsStoreType) {
      case secretsStoreType.AWS_SECRETS_MANAGER:
        instance = new AWSSecretsManagerClient() // Provide necessary configuration
        return instance;
      case secretsStoreType.AZURE_KEY_VAULT:
        instance = new AzureKeyVaultClient();
        return instance;
      case secretsStoreType.KUBERNETES_SECRETS:
        instance = new KubernetesClient();
        return instance;
      case secretsStoreType.LOCAL_SECRETS_MANAGER:
        instance = new LocalSecretsManager();
        return instance;
      default:
        throw new Error(
            `Invalid secrets store type value. Must be one of ${Object.values(
                secretsStoreType)}.`);
    }
  }
}

module.exports = SecretsClientFactory;
