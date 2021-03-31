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
const appID = require("ibmcloud-appid");
const cfEnv = require("cfenv");
const passport = require('passport');
const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init();
const express_enforces_ssl = require("express-enforces-ssl");
const TokenManager = require('ibmcloud-appid').TokenManager;
const isLocal = cfEnv.getAppEnv().isLocal;
const logger = log4js.getLogger('middleware - api-auth-handler');

logger.level = config.logLevel;
const jwt = require('jsonwebtoken');


/**
 * Auth object
 */
const apiAuthHandler = {};

// Configure local configuration and security
let loginConfiguration;

// APPID objects
const APIStrategy = appID.APIStrategy;


let apiStrategy;

apiAuthHandler.getAPIStrategy = () => {
    logger.debug("getAPIStrategy");
    return apiStrategy;
}
apiAuthHandler.getPassport = () => {
    logger.debug("getPassport");
    return passport;
}
/**
 * Get API token from APP ID
 */
apiAuthHandler.getApiToken = async (req, res, next) => {
    logger.debug("get Api Token");
    logger.debug(res.locals.user);
    logger.debug("Login Configuration....");
    logger.debug(loginConfiguration);
    let apiToken;

    try {
        const tokenManager = new TokenManager(loginConfiguration);

        const appIdAuthContext = await tokenManager.getApplicationIdentityToken();

        apiToken = JSON.stringify(appIdAuthContext);
    } catch (err) {
        console.error('Error retrieving tokens : ' + err);
    };
    res.locals.user.apiToken = apiToken;
    next();
}

/**
 * Authenticate API token
 */

// Helper method to retrieve access token from a request header
const _getAccessToken = (req, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const authHeaderComponents = authHeader.split(' ');
            if (authHeaderComponents[0].indexOf('Bearer') !== 0) {
                logger.error("Payload structure deosn't have Bearer token ");
                return null;
            } else {
                logger.info("=============================================================")

                logger.info("[authHeaderComponents.lemgth  " +  authHeaderComponents.length)
                
                logger.info("[authHeaderComponents[0] " +  authHeaderComponents[0])
                
                logger.info("[authHeaderComponents[1] " +  authHeaderComponents[1])
                
                logger.info("=============================================================")
                if (authHeaderComponents.length !== 2 && authHeaderComponents.length !== 3) {
                    logger.error("Malformed authorization header other error")
                    return null;
                } else {
                    return authHeaderComponents[1];
                }
            }
        } else {
            logger.error("Payload structure deosn't have authroization element ")
            return null;
        }
    } catch (error) {
        logger.error("Payload structure deosn't have authroization token " + error)
        return null;
    }
};

/// Middleware - whitelist audiences (For now this is the list of client IDs that can access this app)
/// Early next year, APIStrategy will take care of this and the expected audience will be set to http://this.component.bluemix.net (i.e. the url of this application)


apiAuthHandler.authenticate = (req, res, next) => {
    try {
       
        logger.info("*****************************************************************************")

        logger.info("request.headers.host " + req.headers.host);
       
        logger.info("request.headers.authorization " + req.headers.authorization);
        try {
            logger.debug("request.headers " + JSON.stringify(req.headers));
        } catch (ex){
            logger.info ("error while parsing  req.headers " + ex)
        }
        
        logger.info("request.body.batchID  " + req.body.batchId )
       
        logger.info("request.body.chunkID  " + req.body.chunkId )

        logger.info("****************************************************************************")
        let whitelist = IBMCloudEnv.getDictionary('appid-credentials');
        logger.info("whitelist " + JSON.stringify(whitelist))
       
        const accessTokenString =  _getAccessToken(req, next);
        logger.info("accessTokenString  " + accessTokenString)
        if (accessTokenString == null) {
            res.status(401).send({ error: 'Token value is ' + accessTokenString, message: 'This token does not have the appropriate access rights (aud)' });
        }
        else {

            const accessTokenPayload =  jwt.decode(accessTokenString);
            logger.info("accessTokenPayload.aud " + accessTokenPayload.aud)
            logger.info("jws exp", accessTokenPayload.exp)
            
            var isExpiredToken = false;
            var dateNow = new Date();
            if(accessTokenPayload.exp < dateNow.getTime()/1000)
            {
                isExpiredToken = true;
            }

            if (isExpiredToken) {
                logger.error("token is expired " + accessTokenPayload.exp);
                res.status(401).send({ error: 'expired token', message: 'This token is expired. ' });
            } else {
                const audience = accessTokenPayload.aud;
                if(audience != undefined && audience != null) {
                    logger.info("Aud value is " + audience);
                    if (whitelist.callerId === audience[0]) {
                        next();
                    } else {
                        logger.error("whitelist.callerId === audience[0] is failed ");
                        res.status(401).send({ error: 'invalid_grant', message: 'This token does not have the appropriate access rights (aud)' });
                    }
                } else {
                    logger.error("audience value is " + audience);
                    res.status(401).send({ error: 'invalid_grant', message: 'This token does not have the appropriate access rights (aud)' });
                }
            }
        }
    } catch (error) {
        logger.error("Run time error occured in apiAuthHandler.authenticate " + error);
        res.status(401).send({ error: 'invalid_grant', message: 'This token does not have the appropriate access rights (aud)' });
    }
}

/**
 * get configuration on local envrionment
 */
apiAuthHandler.init = (config) => {
    logger.debug("init");

    let loginConfig = {};
    const localConfig = config;
    const requiredParams = ['clientId', 'secret', 'tenantId', 'oauthServerUrl', 'profilesUrl'];
    requiredParams.forEach(function (requiredParam) {
        if (!localConfig[requiredParam]) {
            logger.error('When running locally, make sure to create a file *localdev-config.json* in the root directory. See config.template.json for an example of a configuration file.');
            logger.error(`Required parameter is missing: ${requiredParam}`);
            process.exit(1);
        }
        loginConfig[requiredParam] = localConfig[requiredParam];
    });
    loginConfig['redirectUri'] = 'http://localhost:3000/ibm/bluemix/appid/callback';
    loginConfiguration = loginConfig;
    apiStrategy = new APIStrategy({
        oauthServerUrl: loginConfiguration.oauthServerUrl
    });
}

/**
 * Access Token Generation flow to be used by UI applications to generate new access tokens and cache it for future use
 * The UI application will call this service to genarate a token and cache it
 * If the UI gets an unauthroized error it will regenarate the token
 * 
 * TODO add caching mechanism and expiry check mechanism
 */
apiAuthHandler.getAccessToken = () => {
    logger.debug("getAccessToken");
    const tokenManager = new TokenManager(loginConfiguration);
    tokenManager.getApplicationIdentityToken().then((appIdAuthContext) => {
        let accessToken = JSON.stringify(appIdAuthContext);
        logger.debug("token retrieved!")
        return accessToken;
    }).catch((err) => {
        logger.error('Error retrieving tokens : ' + err);
    });
}

/**
 * configure standard security and HTTPS
 */
apiAuthHandler.configureSSL = (req, res, next) => {
    logger.debug("configureSSL");
    if (!isLocal) {
        express_enforces_ssl();
    }
    next();
}

module.exports = apiAuthHandler;