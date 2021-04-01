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
const logger = log4js.getLogger('InstallChaincode');
logger.level = config.logLevel;
const util = require('../../../helper/util')

class chainCode {
    constructor(networkConfig, adminCert, request, channelName) {
        this.request = request;
        this.networkConfig = networkConfig;
        this.adminCert = adminCert;
        this.channelName = channelName
    }

    init() {
        util.init(this.networkConfig);
    }

    async install() {
        logger.debug('Installing ChainCode');
        util.installChaincode(this.request, this.adminCert).then((response) => {
            logger.info("Chaincode Installed sucessfully.......")
            return response;
        }).catch((err) => {
            logger.error("Error: " + err);
        });

    }
};


module.exports = chainCode;