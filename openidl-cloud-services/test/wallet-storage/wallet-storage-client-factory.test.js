const { expect } = require('chai');
const WalletStorageFactoryClient = require('../../wallet-storage/wallet-storage-client-factory');
const HashicorpVaultClient = require('../../wallet-storage/hashicorp-vault-client');
const CouchDBWalletClient = require('../../wallet-storage/couchdb-wallet-client');
const walletStorageType = require('../../constants/wallet-storage-type');

describe('WalletStorageFactoryClient', () => {
    describe('Hashicorp Vault storage', () => {
        before(() => {
            process.env['WALLET_STORAGE'] = walletStorageType.HASHICORP_VAULT;
        });

        after(() => {
            process.env['WALLET_STORAGE'] = '';
        });

        it('should return the same HashicorpVaultClient instance for the same storage type twice', async () => {
            const storageClient1 = await WalletStorageFactoryClient.getInstance();
            const storageClient2 = await WalletStorageFactoryClient.getInstance();

            expect(storageClient1).to.be.an.instanceof(HashicorpVaultClient);
            expect(storageClient2).to.be.an.instanceof(HashicorpVaultClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });

    describe('CouchDB storage', () => {
        before(() => {
            process.env['WALLET_STORAGE'] = walletStorageType.COUCHDB;
        });

        after(() => {
            process.env['WALLET_STORAGE'] = '';
        });

        it('should return the same CouchDBWalletClient instance for the same storage type twice', async () => {
            const storageClient1 = await WalletStorageFactoryClient.getInstance();
            const storageClient2 = await WalletStorageFactoryClient.getInstance();

            expect(storageClient1).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient2).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});
