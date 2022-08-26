const AWS = require('aws-sdk');
const csvjson = require('csvjson');
const csvtojson = require('csvtojson');
const logger = require('loglevel');
const config = require('config');
const bucketConfig = require('./config/s3-bucket-config.json');
logger.setLevel("debug");

//set up logging

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
        logger.debug("  records: " + JSON.stringify(input.records))
        let insertObjectParam = { Bucket: bucketConfig.bucketName, Key: input._id, Body: JSON.stringify(input.records) };
        try {
            const data = await bucket.putObject(insertObjectParam).promise();
            logger.debug("After  putobject " + JSON.stringify(data))
            logger.debug('Records Inserted Successfully');
        } catch (err) {
            logger.error(err);
        }
    }


    async getTransactionalData(id) {
        logger.debug("Inside getTransactionalData");
        const accessParams = await this.getAccessParams();
        logger.debug("accessparams: ", accessParams);
        let bucket = new AWS.S3(accessParams);
        let getObjectParam = { Bucket: bucketConfig.bucketName, Key: id };
        try {
            const data = await bucket.getObject(getObjectParam).promise();
            console.log("getobject data is - " + JSON.stringify(data))
            console.log("getobject body is - " + JSON.stringify(JSON.parse(data.Body), null, 2))
            return data
        } catch (err) {
            console.log(err);
            return "error";
        }
    }
    async getCSV(id) {
        logger.debug("Inside getTransactionalData");
        const accessParams = await this.getAccessParams();
        logger.debug("accessparams: ", accessParams);
        let bucket = new AWS.S3(accessParams);
        let getObjectParam = { Bucket: bucketConfig.bucketName, Key: id };
        try {
            // const data = await bucket.getObject(getObjectParam).promise();
            const data = bucket.getObject(getObjectParam).createReadStream();
            console.log("getobject data is - " + JSON.stringify(data))
            // console.log("getobject body is - " + JSON.stringify(JSON.parse(data.Body), null, 2))
            const json = await csvtojson().fromStream(data);
            console.log(json);
            return json;
        } catch (err) {
            console.log(err);
            return "error";
        }
    }
    async uploadCSV(data, datacallId) {
        try {
            const csvData = csvjson.toCSV(data, { headers: 'key' });
            logger.debug("Inside uploadCSV");
            const accessParams = await this.getAccessParams();
            logger.debug("accessparams: ", accessParams);
            let bucket = new AWS.S3(accessParams);
            const params = {
                Bucket: bucketConfig.bucketName, // your bucket name
                Key: "report-" + datacallId + ".csv",
                // ACL: 'public-read',
                Body: csvData,
                ContentType: 'text/csv',
            };
            const uploadresult = await bucket.upload(params).promise();
        } catch (err) {
            console.log(err);
            return "error";
        }
    }
    async getAllObjects() {
        logger.debug("Inside getAllObjects");
        const accessParams = await this.getAccessParams();
        logger.debug("accessparams: ", accessParams);
        let bucket = new AWS.S3(accessParams);
        let listParam = { Bucket: bucketConfig.bucketName,Prefix:bucketConfig.prefix };
        const data = await bucket.listObjectsV2(listParam).promise();
        console.log("listobject data is - " + JSON.stringify(data))
        return data.VersionId
    }
    async getAllObjectsWithPrefix(prefix) {
        logger.debug("Inside getAllObjectsWithPrefix, prefix: ", prefix);
        const accessParams = await this.getAccessParams();
        logger.debug("accessparams: ", accessParams);
        let bucket = new AWS.S3(accessParams);
        let listParam = { Bucket: bucketConfig.bucketName,Prefix:prefix };
        // const data = await bucket.listObjects(listParam).promise();
        const data = await bucket.listObjectsV2(listParam).promise();
        console.log("listobject data is - " + JSON.stringify(data))
        return data.VersionId
    }

    async saveSecretsManager() {
        logger.debug('Inside saveSecretsManager');
        const accessparams = await this.getAccessParams();
		const awsSecretManager = new AWS.SecretsManager(accessparams);
		const vaultCredentials = await awsSecretManager.getSecretValue({ SecretId: "aais-dev-kvs-vault" }).promise();
		const vaultConfig = JSON.parse(vaultCredentials.SecretString);
        logger.debug("  vault config " + JSON.stringify(vaultConfig)); 
    }



    
}
module.exports = S3BucketManager;