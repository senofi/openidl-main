const {expect} = require('chai');
const sinon = require('sinon');
const config = require('config');
const {Wallets} = require('fabric-network');
const HashicorpVaultClient = require('../../cloud-services/wallet-storage/hashicorp-vault-client');
const CouchDBWalletClient = require('../../cloud-services/wallet-storage/couchdb-wallet-client');
const walletStorageType = require('../../cloud-services/constants/wallet-storage-type');
const SecretsClientFactory = require('../../cloud-services/secret/secrets-client-factory');

describe('WalletStorageFactoryClient', () => {
    describe('Hashicorp Vault storage', () => {
        before(() => {
            process.env['WALLET_STORAGE'] = walletStorageType.HASHICORP_VAULT;
            sinon.stub(config, 'get').returns('test');
            const mockSecretsClient = {
                getSecret: () => {
                    return {
                        "url": "http://127.0.0.1:8200",
                        "username": "testuser",
                        "password": "testpassword",
                        "orgName": "kvs",
                        "vaultPath": "kvs-d1",
                        "apiVersion": "v1"
                    };
                }
            }
            sinon.stub(SecretsClientFactory, 'getInstance').returns(mockSecretsClient);
        });

        after(() => {
            process.env['WALLET_STORAGE'] = '';
            sinon.restore()
            delete require.cache[require.resolve('../../wallet-storage/wallet-storage-client-factory')];
        });

        it('should return the same HashicorpVaultClient instance for the same storage type twice', async () => {
            const WalletStorageFactoryClient = require('../../cloud-services/wallet-storage/wallet-storage-client-factory');
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
            sinon.stub(config, 'get').returns('test');
            const mockSecretsClient = {
                getSecret: () => {
                    return {
                        "url": "http://127.0.0.1"
                    };
                }
            }
            sinon.stub(SecretsClientFactory, 'getInstance').returns(mockSecretsClient);
            sinon.stub(Wallets, 'newCouchDBWallet').returns({});
        });

        after(() => {
            process.env['WALLET_STORAGE'] = '';
            sinon.restore()
            delete require.cache[require.resolve('../../wallet-storage/wallet-storage-client-factory')];
        });

        it('should return the same CouchDBWalletClient instance for the same storage type twice', async () => {
            const WalletStorageFactoryClient = require('../../cloud-services/wallet-storage/wallet-storage-client-factory');
            const storageClient1 = await WalletStorageFactoryClient.getInstance();
            const storageClient2 = await WalletStorageFactoryClient.getInstance();

            expect(storageClient1).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient2).to.be.an.instanceof(CouchDBWalletClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});
