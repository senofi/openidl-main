const { expect } = require('chai');
const FileStorageFactory = require('../../storage/file-storage-factory');
const S3BucketClient = require('../../storage/s3bucket-client');
const AzureBlobClient = require('../../storage/azureblob-client');
const cloudEnv = require('../../constants/cloud-env');

describe('FileStorageFactory', () => {
    describe('AWS environment', () => {
        before(() => {
            process.env['CLOUD_ENV'] = cloudEnv.AWS;
        });

        after(() => {
            process.env['CLOUD_ENV'] = '';
        });

        it('should return the same S3BucketClient instance for the same environment twice', async () => {
            const storageClient1 = FileStorageFactory.getInstance();
            const storageClient2 = FileStorageFactory.getInstance();

            expect(storageClient1).to.be.an.instanceof(S3BucketClient);
            expect(storageClient2).to.be.an.instanceof(S3BucketClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });

    describe('Azure environment', () => {
        before(() => {
            process.env['CLOUD_ENV'] = cloudEnv.AZURE;
        });

        after(() => {
            process.env['CLOUD_ENV'] = '';
        });

        it('should return the same AzureBlobClient instance for the same environment twice', async () => {
            const storageClient1 = FileStorageFactory.getInstance();
            const storageClient2 = FileStorageFactory.getInstance();

            expect(storageClient1).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient2).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});
