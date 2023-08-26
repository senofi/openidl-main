const {expect} = require('chai');
const sinon = require('sinon');
const HashicorpVaultClient = require('../../../cloud-services/wallet-storage/hashicorp-vault-client');
const CouchDBWalletClient = require('../../../cloud-services/wallet-storage/couchdb-wallet-client');
const walletStorageType = require('../../../cloud-services/constants/wallet-storage-type');
const config = require('config');

describe('WalletStorageFactoryClient', () => {
    describe('Hashicorp Vault storage', () => {
        before(() => {
            process.env['KVS_CONFIG'] = JSON.stringify({
                walletType: walletStorageType.VAULT,
            });
        });

        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/wallet-storage/wallet-storage-client-factory')];
        });

        it('should return the same HashicorpVaultClient instance for the same storage type twice', async () => {
            const WalletStorageFactoryClient = require('../../../cloud-services/wallet-storage/wallet-storage-client-factory');
            console.log("WALLET TYPE: ", process.env['KVS_CONFIG'])
            const storageClient1 = await WalletStorageFactoryClient.getInstance();
            const storageClient2 = await WalletStorageFactoryClient.getInstance();

            expect(storageClient1).to.be.an.instanceof(HashicorpVaultClient);
            expect(storageClient2).to.be.an.instanceof(HashicorpVaultClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });

    describe('CouchDB storage', () => {
        before(() => {
            process.env['KVS_CONFIG'] = JSON.stringify({
                walletType: walletStorageType.COUCHDB,
            });
        });

        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/wallet-storage/wallet-storage-client-factory')];
        });

        it('should return the same CouchDBWalletClient instance for the same storage type twice', async () => {
            const WalletStorageFactoryClient = require('../../../cloud-services/wallet-storage/wallet-storage-client-factory');
            const storageClient1 = await WalletStorageFactoryClient.getInstance();
            const storageClient2 = await WalletStorageFactoryClient.getInstance();

            expect(storageClient1).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient2).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});