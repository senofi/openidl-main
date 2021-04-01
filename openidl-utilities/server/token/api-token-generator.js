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
 
const TokenManager = require('ibmcloud-appid').TokenManager;
const loginConfig = require('./config/local-appid-config.json');

getApiToken = async() => {
    let apiToken;
    try {
        const tokenManager = new TokenManager(loginConfig);
        const appIdAuthContext = await tokenManager.getApplicationIdentityToken();
        apiToken = JSON.stringify(appIdAuthContext, undefined, 2);
        console.log('Your App ID token has been generated; see below for details:');
        console.log(apiToken);
    } catch (err) {
        console.error('Error retrieving token: ' + err);
    };
}

getApiToken();