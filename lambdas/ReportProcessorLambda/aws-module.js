const AWS = require('aws-sdk');
const csvjson = require('csvjson');
const csvtojson = require('csvtojson');
const logger = require('loglevel');
const config = require('config');
const bucketConfig = require('./config/s3-bucket-config.json');
logger.setLevel(config.get('loglevel'));

//configuring the AWS environment
AWS.config.update({
    accessKeyId: bucketConfig.accessKeyId,
    secretAccessKey: bucketConfig.secretAccessKey
});
class S3BucketManager {
    constructor() { }
    async getAccessParams() {
        const sts = new AWS.STS({
            region: 'us-east-2',
            accessKeyId: bucketConfig.accessKeyId,
            secretAccessKey: bucketConfig.secretAccessKey

        });
        const params = bucketConfig.roleParams;

        const accessParamInfo = await sts.assumeRole(params).promise();
        logger.debug('Changed Credentials');

        const accessparams = {
            accessKeyId: accessParamInfo.Credentials.AccessKeyId,
            secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
            sessionToken: accessParamInfo.Credentials.SessionToken,
            region: 'us-east-2'
        };
        return accessparams;
    }

    async saveTransactionalData(input) {
        logger.debug('Inside saveTransactionalData');
        const accessparams = await this.getAccessParams();
        let bucket = new AWS.S3(accessparams);
        logger.debug(" saveObjectParam bucket: " + bucketConfig.bucketName + " key: " + input._id)
        let insertObjectParam = { Bucket: bucketConfig.bucketName, Key: input._id, Body: JSON.stringify(input.records) };
        try {
            const data = await bucket.putObject(insertObjectParam).promise();
            logger.debug('Records Inserted Successfully');
        } catch (err) {
            logger.error(err);
        }
    }


    async getTransactionalData(id) {
        logger.debug("Inside getTransactionalData");
        const accessParams = await this.getAccessParams();
        let bucket = new AWS.S3(accessParams);
        let getObjectParam = { Bucket: bucketConfig.bucketName, Key: id };
        try {
            const data = await bucket.getObject(getObjectParam).promise();
            return data
        } catch (err) {
            logger.error(err);
        }
    }
    async getCSV(id) {
        logger.debug("Inside getTransactionalData");
        const accessParams = await this.getAccessParams();
        let bucket = new AWS.S3(accessParams);
        let getObjectParam = { Bucket: bucketConfig.bucketName, Key: id };
        try {
            const data = bucket.getObject(getObjectParam).createReadStream();
            const json = await csvtojson().fromStream(data);
            return json;
        } catch (err) {
            logger.error(err);
        }
    }
    async uploadCSV(data, datacallId) {
        try {
            const csvData = csvjson.toCSV(data, { headers: 'key' });
            logger.debug("Inside uploadCSV");
            const accessParams = await this.getAccessParams();
            let bucket = new AWS.S3(accessParams);
            const params = {
                Bucket: bucketConfig.bucketName, // your bucket name
                Key: "report-" + datacallId + ".csv",
                Body: csvData,
                ContentType: 'text/csv',
            };
            await bucket.upload(params).promise();
        } catch (err) {
            logger.error(err);
        }
    }
}
module.exports = S3BucketManager;