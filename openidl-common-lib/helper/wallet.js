/**
 * Updated Implementation of FileSystem Memory Wallet with InMemory Wallet
 * Same applies to couchdb wallet to be implemented
 */
const log4js = require('log4js');
const {
  Wallets,
} = require('fabric-network');
const { WalletStorageClientFactory } = require('../cloud-services');

const logger = log4js.getLogger('helpers - wallet');
logger.level = process.env.LOG_LEVEL || 'debug';

/**
 * Wallet object
 */
const wallet = {};

let persistantWallet;

// memory wallet for caching
let memoryWallet = {};

wallet.init = async () => {
  memoryWallet = await Wallets.newInMemoryWallet();
  persistantWallet = await WalletStorageClientFactory.getInstance();
};

/**
 * Return inmemory wallet and hide FileSystemWallet object
 */
wallet.getWallet = () => memoryWallet;

/**
 * check if the identity exists in memory wallet
 * @param {string} id - label of id in wallet
 */
wallet.identityExists = async (id) => {
  let existsInMemory = await memoryWallet.get(id);
  if (!existsInMemory) {
    logger.debug(`Identity doesn't exists in memory, checking in persistant database...${id}`);
    const existsInPersistant = await persistantWallet.get(id);
    if (!existsInPersistant) {
      throw new Error('Invalid Identity, no certificate found in certificate store');
    } else {
      // export from persistant wallet and store in memory wallet
      logger.debug(`Identity ${id} found in persistant store`);
      const identity = await exportIdentity(id);
      logger.debug('Identity Exported ', id, ', importing to memory wallet');

      await memoryWallet.put(id, identity);
      logger.debug('Identity ', id, 'imported to memory wallet');
      existsInMemory = true;
    }
  }
  logger.debug(`${id} exists in wallet: ${existsInMemory}`);
  return existsInMemory;
};

/**
 *
 * @param {string} id - label of id importing into wallet
 */
let exportIdentity = async (id) => {
  try {
    logger.debug(`Export ${id} from persistant wallet`);
    return await persistantWallet.get(id);
  } catch (err) {
    logger.debug(`Error Exorting ${id} into wallet: ${err}`);
    throw new Error(err);
  }
};

/**
 *
 * @param {string} id - label of id importing into wallet
 * @param {string} org - org that id belongs to
 * @param {string} cert - cert from enrolling user
 * @param {string} key - key from enrolling user
 */
wallet.importIdentity = async (id, x509Identity) => {
  // check if the identity exists in persistant wallet
  const exists = await persistantWallet.get(id);
  if (exists === undefined) {
    try {
      logger.debug(`Importing ${id} into wallet`);
      await persistantWallet.put(id, x509Identity);
    } catch (err) {
      logger.debug(`Error importing ${id} into wallet: ${err}`);
      throw new Error(err);
    }
  }
  // export from persistant wallet and store in memory wallet
  const identity = await exportIdentity(id);
  logger.debug('Identity Exported ', id, ', importing to memory wallet');
  await memoryWallet.put(id, identity);
  logger.debug('Identity ', id, 'imported to memory wallet');
};

module.exports = wallet;
