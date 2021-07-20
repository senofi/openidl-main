/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by cognitolicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var cognitoUserRegister = {};

const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();

const cognitoConfig = IBMCloudEnv.getDictionary('cognito-credentials');
const config = require('../config/default.json');

const AWS = require('aws-sdk');
AWS.config.update(IBMCloudEnv.getDictionary('cognito-admin-credentials'));
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: cognitoConfig.region
});

const log4js = require('log4js');
const logger = log4js.getLogger('cognito - cognitouser');
logger.level = config.logLevel;

/**
 * Creates a user in aws cognito
 */
cognitoUserRegister.createUserInCognito = async (usersConfig) => {
    let users = usersConfig.users;

    for (var i = 0; i < users.length; i++) {
        logger.debug("Request > " + users[i]);
        let params = {
            UserPoolId: cognitoConfig.userPoolId,
            Username: users[i].userName,
            TemporaryPassword: users[i].password,
            UserAttributes: [
                {
                    Name: 'email_verified',
                    Value: "true"
                }
            ]
        };
        Object.keys(users[i].attributes).forEach(function (key) {
            params.UserAttributes.push({
                Name: key,
                Value: users[i].attributes[key]
            })
        });
        await cognitoidentityserviceprovider.adminCreateUser(params).promise();

        params = {
            UserPoolId: cognitoConfig.userPoolId,
            Username: users[i].userName,
            Password: users[i].password,
            Permanent: true
        };
        await cognitoidentityserviceprovider.adminSetUserPassword(params).promise();
    }
}


/**
 * Update user atrributes in aws cognito
 */
cognitoUserRegister.updateUserAttributes = async (usersConfig) => {
    let users = usersConfig.users;

    for (var i = 0; i < users.length; i++) {
        logger.debug("Request > " + users[i]);
        const params = {
            UserPoolId: cognitoConfig.userPoolId,
            Username: users[i].userName,
            UserAttributes: []
        };
        Object.keys(users[i].attributes).forEach(function (key) {
            params.UserAttributes.push({
                Name: key,
                Value: users[i].attributes[key]
            })
        });
        await cognitoidentityserviceprovider.adminUpdateUserAttributes(params).promise();
    }
}

module.exports = cognitoUserRegister;