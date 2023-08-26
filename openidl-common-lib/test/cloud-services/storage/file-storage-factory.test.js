const { expect } = require('chai');
const S3BucketClient = require('../../../cloud-services/file-storage/impl/s3bucket-client');
const AzureBlobClient = require('../../../cloud-services/file-storage/impl/azureblob-client');
const fileStoreType = require('../../../cloud-services/constants/file-store-type');

describe('FileStorageFactory', () => {
    describe('AWS environment', () => {
        before(() => {
            process.env['KVS_CONFIG'] = JSON.stringify({fileStoreType: fileStoreType.S3});
        });

        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/file-storage/file-storage-client-factory')];
            process.env['KVS_CONFIG'] = JSON.stringify({});
        });

        it('should return the same S3BucketClient instance for the same environment twice', async () => {
            const FileStorageClientFactory = require('../../../cloud-services/file-storage/file-storage-client-factory');
            const storageClient1 = FileStorageClientFactory.getInstance();
            const storageClient2 = FileStorageClientFactory.getInstance();

            expect(storageClient1).to.be.an.instanceof(S3BucketClient);
            expect(storageClient2).to.be.an.instanceof(S3BucketClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });

    describe('Azure environment', () => {
        before(() => {
            process.env['KVS_CONFIG'] = JSON.stringify({ fileStoreType: fileStoreType.AZURE_BLOB });
        });

        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/file-storage/file-storage-client-factory')];
            process.env['KVS_CONFIG'] = JSON.stringify({});
        });

        it('should return the same AzureBlobClient instance for the same environment twice', async () => {
            const FileStorageFactory = require('../../../cloud-services/file-storage/file-storage-client-factory');
            const storageClient1 = FileStorageFactory.getInstance();
            const storageClient2 = FileStorageFactory.getInstance();

            expect(storageClient1).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient2).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});
