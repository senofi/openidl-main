const { expect } = require('chai');
const S3BucketClient = require('../../../cloud-services/file-storage/impl/s3bucket-client');
const AzureBlobClient = require('../../../cloud-services/file-storage/impl/azureblob-client');
const fileStoreType = require('../../../cloud-services/constants/file-store-type');
const sinon = require('sinon');

describe('FileStorageFactory', () => {
    describe('AWS environment', () => {
        let configStub;
        before(() => {
            configStub = sinon.stub(require('config'), 'get');
            configStub.withArgs('fileStoreType').returns(fileStoreType.S3)
            process.env['S3_BUCKET_CONFIG'] = JSON.stringify({
                "bucketName": "openidl-analytics",
    })
        });
        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/file-storage/file-storage-client-factory')];
            configStub.restore();
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
        let configStub;
        before(() => {
            configStub = sinon.stub(require('config'), 'get');
            configStub.withArgs('fileStoreType').returns(fileStoreType.AZURE_BLOB)
            process.env['AZURE_BLOB_CONFIG'] = JSON.stringify({
                 "accountName": "testName",
                 "accountKey": "testKey",
                 "blobServiceUrl": "testUrl",
                 "containerName": "testContainerName"
            })
        });

        after(() => {
            delete require.cache[require.resolve('../../../cloud-services/file-storage/file-storage-client-factory')];
            configStub.restore();
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
