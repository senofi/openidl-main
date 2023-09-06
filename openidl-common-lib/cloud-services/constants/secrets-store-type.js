const secretsStoreType = Object.freeze({
  AWS_SECRETS_MANAGER: 'aws-secrets-manager',
  AZURE_KEY_VAULT: 'azure-key-vault',
  KUBERNETES_SECRETS: 'kubernetes-secrets',
  LOCAL_SECRETS_MANAGER: 'local'
})

module.exports = secretsStoreType;