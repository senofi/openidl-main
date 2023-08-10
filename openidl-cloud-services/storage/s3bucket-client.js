const AWS = require('aws-sdk');
const log4js = require('log4js');
const config = require('config');
const AbstractFileStorageClient = require('./abstract-file-storage-client');

//set up logging
const logger = log4js.getLogger('s3bucket-client');
logger.level = config.logLevel;

class S3BucketClient extends AbstractFileStorageClient {
    constructor() {
        super();
        this.bucketConfig = require('../config/s3-bucket-config.json')
        this.bucketName = this.bucketConfig.bucketName;
        //configuring the AWS environment
        AWS.config.update({
            accessKeyId: this.bucketConfig.accessKeyId, secretAccessKey: this.bucketConfig.secretAccessKey
        });
    }

    async _getAccessParams() {
        const sts = new AWS.STS({
            //region: 'us-east-2',
            accessKeyId: this.bucketConfig.accessKeyId, secretAccessKey: this.bucketConfig.secretAccessKey

        });
        const params = this.bucketConfig.roleParams;

        const accessParamInfo = await sts.assumeRole(params).promise();

        const accessparams = {
            accessKeyId: accessParamInfo.Credentials.AccessKeyId,
            secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
            sessionToken: accessParamInfo.Credentials.SessionToken,
        };
        return accessparams;
    }

    async getObjectsByPrefix(prefix) {
        const accessParams = await this._getAccessParams();
        let bucket = new AWS.S3(accessParams);
        let getObjectParam = {Bucket: this.bucketName, Prefix: prefix};
        try {
            return bucket.listObjects(getObjectParam).promise();
        } catch (err) {
            logger.error(err)
            return Promise.reject(err);
        }
    }

    async getObjectById(id) {
        const accessParams = await this._getAccessParams();
        let bucket = new AWS.S3(accessParams);
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
        const accessparams = await this._getAccessParams();
        let bucket = new AWS.S3(accessparams);
        let insertObjectParam = {Bucket: this.bucketName, Key: id, Body: JSON.stringify(body)};
        try {
            return bucket.upload(insertObjectParam).promise();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

    async uploadStream(id, streamData) {
        const accessparams = await this._getAccessParams();
        let bucket = new AWS.S3(accessparams);
        const insertObjectParam = {Bucket: this.bucketName, Key: id, Body: streamData};
        try {
            return bucket.upload(insertObjectParam).promise();
        } catch (err) {
            logger.error(err);
            return Promise.reject(err);
        }
    }

    async deleteObject(id) {
        const accessParams = await this._getAccessParams();
        let bucket = new AWS.S3(accessParams);
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