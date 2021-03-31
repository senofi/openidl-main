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
const path = require('path');
const nconf = require("nconf");
const appID = require("ibmcloud-appid");
const cfEnv = require("cfenv");
const passport = require('passport');
const helmet = require("helmet");
const express_enforces_ssl = require("express-enforces-ssl");
const cookieParser = require("cookie-parser");
const TokenManager = require('ibmcloud-appid').TokenManager;
const request = require('request-promise');
const isLocal = cfEnv.getAppEnv().isLocal;
const logger = log4js.getLogger('middleware - api-auth-handler');
logger.setLevel(config.logLevel);


/**
 * Auth object
 */
const apiAuthHandler = {
  apiToken:''
};

// Configure local configuration and security
let loginConfiguration;

// APPID objects
const APIStrategy = appID.APIStrategy;
const UnauthorizedException = appID.UnauthorizedException;

let apiStrategy;

apiAuthHandler.setToken = (token) => {
  logger.debug('Indeis set token');
  apiAuthHandler.apiToken = token;
}

apiAuthHandler.getToken = () => {
  return apiAuthHandler.apiToken;
}

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
        logger.debug('API TOKEN');
        logger.debug(apiToken);
    } catch (err) {
        console.error('Error retrieving tokens : ' + err);
    };
    apiAuthHandler.setToken(apiToken);
    next();
}

/**
 * Authenticate API token
 */
apiAuthHandler.authenticate = (req, res, next) => {
  req.headers["authorization"] = 'Bearer '+ JSON.parse(apiAuthHandler.getToken()).accessToken;
  logger.debug('inside api authenticate');
  logger.debug(req.headers);
    passport.authenticate(APIStrategy.STRATEGY_NAME, function (err, user, info) {
      if (err || info) {
          logger.debug("if err or infor");
          logger.debug(err);
          // Recreate token
          apiAuthHandler.getApiToken();
      } else {
        next();
      }
  })(req, res, next);

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
            console.error('When running locally, make sure to create a file *localdev-config.json* in the root directory. See config.template.json for an example of a configuration file.');
            console.error(`Required parameter is missing: ${requiredParam}`);
            process.exit(1);
        }
        loginConfig[requiredParam] = localConfig[requiredParam];
    });
    loginConfig['redirectUri'] = 'http://localhost:3000/ibm/bluemix/appid/callback';
    loginConfiguration =  loginConfig;
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
    let accessToken;
    const tokenManager = new TokenManager(loginConfiguration);
    tokenManager.getApplicationIdentityToken().then((appIdAuthContext) => {
        accessToken = JSON.stringify(appIdAuthContext);
        logger.debug("token retrieved!")
    }).catch((err) => {
        console.error('Error retrieving tokens : ' + err);
    });
    res.locals.user.apiToken = accessToken;
    next();
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
