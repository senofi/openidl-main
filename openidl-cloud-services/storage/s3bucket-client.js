const AWS = require('aws-sdk');
const log4js = require('log4js');
const config = require('config');
const AbstractFileStorageClient = require('./abstract-file-storage-client');
const getAccessParams = require('../utils/awsAccessParams');

//set up logging
const logger = log4js.getLogger('s3bucket-client');
logger.level = config.logLevel;

class S3BucketClient extends AbstractFileStorageClient {
    constructor() {
        super();
        this.bucketName = config.get('bucketName')
    }

    async _getClient() {
        const accessParams = await getAccessParams();
        return new AWS.S3(accessParams);
    }

    async getObjectsByPrefix(prefix) {
        let bucket = await this._getClient();
        let getObjectParam = {Bucket: this.bucketName, Prefix: prefix};
        try {
            return bucket.listObjects(getObjectParam).promise();
        } catch (err) {
            logger.error(err)
            return Promise.reject(err);
        }
    }

    async getObjectById(id) {
        let bucket = await this._getClient();
        let getObjectParam = {Bucket: this.bucketName, Key: id};
        try {
            const response = await bucket.getObject(getObjectParam).promise();
            const data = response.Body.toString();
            return JSON.parse(data);
        } catch (err) {
            logger.error(err)
            return Promise.reject(err);
        }
    }

    async saveObject(id, body) {
        let bucket = await this._getClient();
        let insertObjectParam = {Bucket: this.bucketName, Key: id, Body: JSON.stringify(body)};
        try {
            return bucket.upload(insertObjectParam).promise();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

    async uploadStream(id, streamData) {
        let bucket = await this._getClient();
        const insertObjectParam = {Bucket: this.bucketName, Key: id, Body: streamData};
        try {
            return bucket.upload(insertObjectParam).promise();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

    async deleteObject(id) {
        let bucket = await this._getClient();
        let deleteObjectParam = {Bucket: this.bucketName, Key: id};

        try {
            return bucket.deleteObject(deleteObjectParam).promise();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

}

module.exports = S3BucketClient;