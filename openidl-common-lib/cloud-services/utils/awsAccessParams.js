const AWS = require('aws-sdk');

const getAccessParams = async (config) => {
  const sts = new AWS.STS({
    region: config['region'],
    accessKeyId: config['accessKeyId'],
    secretAccessKey: config['secretAccessKey']
  });
  const roleParams = config['roleParams'];

  const accessParamInfo = await sts.assumeRole(roleParams).promise();

  return {
    accessKeyId: accessParamInfo.Credentials.AccessKeyId,
    secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
    sessionToken: accessParamInfo.Credentials.SessionToken,
    region: config['region']
  };
}

module.exports = getAccessParams;