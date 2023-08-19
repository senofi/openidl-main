const { expect } = require('chai');
const config = require('config')
const sinon = require('sinon');
const S3BucketClient = require('../../file-storage/impl/s3bucket-client');
const AzureBlobClient = require('../../file-storage/impl/azureblob-client');
const cloudEnv = require('../../constants/cloud-env');

describe('FileStorageFactory', () => {
    describe('AWS environment', () => {
        before(() => {
            process.env['CLOUD_ENV'] = cloudEnv.AWS;
            sinon.stub(config, 'get').returns('test');
        });

        after(() => {
            process.env['CLOUD_ENV'] = '';
            sinon.restore();
            delete require.cache[require.resolve('../../storage/storage-client-factory')];
        });

        it('should return the same S3BucketClient instance for the same environment twice', async () => {
            const FileStorageFactory = require('../../file-storage/file-storage-client-factory');
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
            sinon.stub(config, 'get').returns('test');
        });

        after(() => {
            process.env['CLOUD_ENV'] = '';
            sinon.restore();
            delete require.cache[require.resolve('../../storage/storage-client-factory')];
        });

        it('should return the same AzureBlobClient instance for the same environment twice', async () => {
            const FileStorageFactory = require('../../file-storage/file-storage-client-factory');
            const storageClient1 = FileStorageFactory.getInstance();
            const storageClient2 = FileStorageFactory.getInstance();

            expect(storageClient1).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient2).to.be.an.instanceof(AzureBlobClient);
            expect(storageClient1).to.equal(storageClient2);
        });
    });
});
