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
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an 'AS IS' BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/


const log4js = require('log4js');
const config = require('config');
const logger = log4js.getLogger('controllers - app-user-controller');
const appUserRegistration = require('../app/app-user');
logger.level = config.logLevel;

/**
 * Controller object
 */
const appRegistrationAPI = {};

appRegistrationAPI.register = async (req, res) => {

    logger.info("app user register method entry -");
    let payload;
    let jsonRes;
    payload = req.body;
    logger.info(payload)

    try {
        await appUserRegistration.createUserInLocalDb(payload);
        logger.info("User created  = " + new Date().toISOString());
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'User Created'
        };
    } catch (err) {
        logger.error('Error while creating user ', err);
        jsonRes = {
            statusCode: 500,
            success: false,
            message: `FAILED: User creation failed.` + err,
        };
    }
    appRegistrationAPI.sendResponse(res, jsonRes);
};

appRegistrationAPI.updateUserAttributes = async (req, res) => {
    logger.info('app user attributes method entry -');
    let payload;
    let jsonRes;
    payload = req.body;
    logger.info(payload)

    try {
        await appUserRegistration.updateUserInLocalDb(payload);
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
    appRegistrationAPI.sendResponse(res, jsonRes);
};

appRegistrationAPI.sendResponse = async (res, msg) => {
    const response = msg;
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = response.statusCode;
    delete response.statusCode;
    res.json(response);
};


module.exports = appRegistrationAPI;
