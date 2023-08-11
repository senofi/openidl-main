const AWS = require('aws-sdk');
const config = require('config');

const getAccessParams = async () => {
    const sts = new AWS.STS({
        region: config.get('region'),
        accessKeyId: config.get('accessKeyId'),
        secretAccessKey: config.get('secretAccessKey')
    });
    const roleParams = config.get('roleParams');

    const accessParamInfo = await sts.assumeRole(roleParams).promise();

    return {
        accessKeyId: accessParamInfo.Credentials.AccessKeyId,
        secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
        sessionToken: accessParamInfo.Credentials.SessionToken,
        region: config.get('region')
    };
}

module.exports = getAccessParams;