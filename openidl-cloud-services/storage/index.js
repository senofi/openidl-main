const cloudEnv = require('../constants/cloud-env');
const S3BucketClient = require('./s3bucket-client');
const AzureBlobClient = require('./azureblob-client');

let instance = null;

class FileStorageFactory {
    /**
     * Returns an instance of the file storage client.
     * @returns {AbstractFileStorageClient} File storage client.
     */
    static getInstance() {
        if (instance) {
            return instance;
        }

        switch (process.env.CLOUD_ENV) {
            case  cloudEnv.AWS:
                instance = new S3BucketClient();
                break;
            case cloudEnv.AZURE:
                instance = new AzureBlobClient();
                break;
            default:
                throw new Error(`Invalid CLOUD_ENV value. Must be one of ${Object.values(cloudEnv)}.`);
        }

        return instance;
    }
}


module.exports = FileStorageFactory;