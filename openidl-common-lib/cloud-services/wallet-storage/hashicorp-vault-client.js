const log4js = require('log4js');
const config = require('config');
const nodeVaultModule = require("node-vault")
const SecretsClientFactory = require('../secret/secrets-client-factory');
const AbstractWalletStorageClient = require('./abstract-wallet-storage-client');

const logger = log4js.getLogger('helpers - hashicorpvaultwallet');
logger.level = process.env.LOG_LEVEL || 'debug';

class HashicorpVaultClient extends AbstractWalletStorageClient {
  VAULT_CONFIG_SECRET_NAME = "hv-credential";

  constructor() {
    super();
  }

  async _getNodeVault() {
    const nodeVault = nodeVaultModule({
      apiVersion: this.vaultConfig.apiVersion,
      endpoint: this.vaultConfig.url
    });
    // login to vault to retrieve the auth token
    const result = await nodeVault.userpassLogin({
      "username": this.vaultConfig.username,
      "password": this.vaultConfig.password,
      "mount_point": this.vaultConfig.orgName
    });
    nodeVault.token = result.auth.client_token; // Add token to vault object for subsequent requests.
    return nodeVault;
  }

  async init() {
    const kvsConfig = JSON.parse(process.env.KVS_CONFIG);
    const secretsClient = await SecretsClientFactory.getInstance();
    const vaultConfig = await secretsClient.getSecret(
        kvsConfig.walletStorageSecretName || this.VAULT_CONFIG_SECRET_NAME);

    if (!vaultConfig) {
      throw new Error('No vaultConfig given');
    }
    if (!vaultConfig.url) {
      throw new Error('No url given');
    }
    if (!vaultConfig.apiVersion) {
      throw new Error('No apiVersion given');
    }
    if (!vaultConfig.vaultPath) {
      throw new Error('No vaultPath given');
    }
    if (!vaultConfig.username) {
      throw new Error('No username given');
    }
    if (!vaultConfig.password) {
      throw new Error('No password given');
    }
    if (!vaultConfig.orgName) {
      throw new Error('No orgName given');
    }
    this.vaultConfig = vaultConfig;

    return this;
  }

  async get(name) {
    try {
      let id;
      let identity;
      const nodeVault = await this._getNodeVault()
      try {
        const {data} = await nodeVault.read(
            `${this.vaultConfig.orgName}/data/${this.vaultConfig.vaultPath}/${name}`);
        id = data.data.id;
        identity = data.data.data;
      } catch (err) {
        logger.error(err)
      }
      return name === id ? JSON.parse(identity) : undefined;
    } catch (e) {
      logger.error(e);
      return Promise.reject(e);
    }
  }

  async put(name, identity) {
    try {
      const nodeVault = await this._getNodeVault()
      const data = JSON.stringify(identity);

      await nodeVault.write(
          `${this.vaultConfig.orgName}/data/${this.vaultConfig.vaultPath}/${name}`,
          {
            "data": {
              "id": name,
              "data": data
            }
          });
    } catch (err) {
      logger.error(err)
      return Promise.reject(err)
    }
  }
}

module.exports = HashicorpVaultClient;
