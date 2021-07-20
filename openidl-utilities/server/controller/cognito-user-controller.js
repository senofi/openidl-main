'use strict';

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


const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('controllers - cognito-user-controller');
const cognitoUserRegistration = require('../app/cognito-user');
logger.level = config.logLevel;

/**
 * Controller object
 */
const cognitoRegistrationAPI = {};

cognitoRegistrationAPI.register = async (req, res) => {
    logger.info('cognito user register method entry -');
    let payload;
    let jsonRes;
    payload = req.body;
    logger.info(payload)

    try {
        await cognitoUserRegistration.createUserInCognito(payload);
        logger.info('User created  = ' + new Date().toISOString());
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'User Created'
        };

    } catch (err) {
        logger.error('User Registration error ', err);
        jsonRes = {
            statusCode: 500,
            success: false,
            message: `FAILED: User registration failed.` + err,
        };

    }
    cognitoRegistrationAPI.sendResponse(res, jsonRes);
};


cognitoRegistrationAPI.updateUserAttributes = async (req, res) => {
    logger.info('cognito user attributes method entry -');
    let payload;
    let jsonRes;
    payload = req.body;
    logger.info(payload)

    try {
        await cognitoUserRegistration.updateUserAttributes(payload);
        logger.info('User attributes updated  = ' + new Date().toISOString());
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'User attributes updated'
        };

    } catch (err) {
        logger.error('User attributes update error ', err);
        jsonRes = {
            statusCode: 500,
            success: false,
            message: `FAILED: User atrributes update failed.` + err,
        };

    }
    cognitoRegistrationAPI.sendResponse(res, jsonRes);
};

cognitoRegistrationAPI.login = async (req, res) => {
    logger.info('cognito user login method entry -');
    let payload;
    let jsonRes;
    payload = req.body;
    logger.info(payload)

    if (res.locals && res.locals.user) {
        jsonRes = {
            statusCode: 200,
            success: true,
            result: res.locals.user
        };

    } else {
        jsonRes = {
            statusCode: 500,
            success: false,
            message: 'Authentication failed,Please contact system administrator'
        };
    }
    cognitoRegistrationAPI.sendResponse(res, jsonRes);
};

cognitoRegistrationAPI.sendResponse = async (res, msg) => {
    const response = msg;
    res.setHeader('Content-Type', 'cognitolication/json');
    res.statusCode = response.statusCode;
    delete response.statusCode;
    res.json(response);
};


module.exports = cognitoRegistrationAPI;