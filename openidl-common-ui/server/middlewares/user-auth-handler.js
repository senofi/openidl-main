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

// const app = require('express');
const log4js = require('log4js');
const config = require('config');
// const path = require('path');
// const nconf = require("nconf");
const appID = require("ibmcloud-appid");
const cfEnv = require("cfenv");
const passport = require('passport');
// const helmet = require("helmet");
const express_enforces_ssl = require("express-enforces-ssl");
// const cookieParser = require("cookie-parser");
// const request = require("request-promise");

const isLocal = cfEnv.getAppEnv().isLocal;
const logger = log4js.getLogger('middleware - user-auth-handler');
// logger.setLevel(config.logLevel);
logger.level = config.logLevel;


/**
 * Auth object
 */
const userAuthHandler = {
  identityToken: ''
};

// Configure local configuration and security
let loginConfiguration;

userAuthHandler.setToken = (token) => {
  logger.debug('Inside set token');
  userAuthHandler.identityToken = token;
}

userAuthHandler.getToken = () => {
  return userAuthHandler.identityToken;
}

// APPID objects
const WebAppStrategy = appID.WebAppStrategy;
const APIStrategy = appID.APIStrategy; // TODO to be implemented for API-AUTH
const userProfileManager = appID.UserProfileManager;
const UnauthorizedException = appID.UnauthorizedException;

let webAppStrategy;

userAuthHandler.getUserAuthStrategy = () => {
  return webAppStrategy;
}
userAuthHandler.getPassport = () => {
  logger.debug("getPassport");
  return passport;
}
/**
 * Initialize Passport middleware
 */

userAuthHandler.initUserProfileManager = (req, res, next) => {
  logger.debug("initUserProfileManager");
  userProfileManager.init(loginConfiguration);
  next();
}


userAuthHandler.shouldAuthenticate = (req, res, next) => {
  logger.debug('Inside should authenticate');
  req.headers['authorization'] = 'Bearer ' + req.headers['usertoken']
  logger.debug(req.headers);
  passport.authenticate(webAppStrategy.STRATEGY_NAME, {
    session: false
  })(req, res, next);
}

/**
 * verify if the user is logged in or not
 */
userAuthHandler.isLoggedIn = (req, res, next) => {
  logger.debug('Inside isLoggedIn');
  logger.debug(req.session[WebAppStrategy.AUTH_CONTEXT]);
  if (!req.session[WebAppStrategy.AUTH_CONTEXT]) {
    res.status(401).send('Unauthorized');
  } else {
    logger.debug('user is logged in');
    next();
  }
}

/**
 * Get the user role
 */
userAuthHandler.getUserRole = async (req, res, next) => {
  logger.debug('Inside get user role');
  let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  let identityToken = req.session[WebAppStrategy.AUTH_CONTEXT].identityToken;
  logger.debug(accessToken);
  let attributes;
  try {
    attributes = await userProfileManager.getAllAttributes(accessToken, identityToken);
  } catch (e) {
    logger.error("getUserAtribute failed ", e);
    res.status(401).send('Unauthorized');
  }
  if (attributes) {
    res.locals.role = attributes.role;
    logger.debug('ROLE');
    logger.debug(res.locals.role);
    if (res.locals.role == 'regulator') {
      logger.debug('Juridiction');
      logger.debug(res.locals.juridiction);
      res.locals.juridiction = (attributes.stateName);
    } else {
      logger.debug('Juridiction');
      logger.debug(res.locals.juridiction);
      res.locals.juridiction = (attributes.organizationId).split(' ')[0];
    }
    next();
  }
}

/**
 * configure standard security and HTTPS
 */
userAuthHandler.refreshToken = (req) => {
  logger.debug("refreshToken");
  return webAppStrategy.refreshTokens(req, req.cookies.refreshToken)
}

/**
 * Authenticate using passport
 */
userAuthHandler.authenticate = (req, res, next) => {
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, function (err, user, info) {
    if (err || info) {
      logger.debug("if err or infor");
      logger.debug(err);
      res.status(500).json({
        'message': info.message
      });
    } else {
      req.logIn(user, function (err) {
        logger.debug("req.logIn", user);
        if (err) {
          res.status(500).json({
            'message': 'Error logging in. Contact admin.'
          });
        } else {
          logger.debug('USER RESPONSE AFTER WEB STRATEGY');
          logger.debug(user);
          let userResopnse = {
            "name": user.name,
            "username": user.email
          };
          res.locals.user = userResopnse;
          next();
        }
      });
    }
  })(req, res, next);
}
/**
 * callback handler
 */
userAuthHandler.callback = (req, res, next) => {
  logger.debug("authHandler.callback");
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    failureRedirect: '/error',
    failureFlash: true,
    allowAnonymousLogin: false
  });
  next();
}
/**
 * Store token in cookie
 */
userAuthHandler.storeRefreshTokenInCookie = (req, res, next) => {
  logger.debug("storeRefreshTokenInCookie");
  if (req.session[WebAppStrategy.AUTH_CONTEXT] && req.session[WebAppStrategy.AUTH_CONTEXT].refreshToken) {
    const refreshToken = req.session[WebAppStrategy.AUTH_CONTEXT].refreshToken;
    logger.debug('refreshing cookie');
    /* An example of storing user's refresh-token in a cookie with expiration of a month */
    res.cookie('refreshToken', refreshToken, {
      maxAge: 15000 /* 30 days */
    });
  }
  next();
}

userAuthHandler.storeTokenInCookie = (req, res, next) => {

  if (req.session) {
    res.cookie(WebAppStrategy.AUTH_CONTEXT, req.session[WebAppStrategy.AUTH_CONTEXT].accessToken);
  }

  next();
}

userAuthHandler.getUserInfo = async (req, res, next) => {
  logger.debug("getUserAttributes");
  let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  let identityToken = req.session[WebAppStrategy.AUTH_CONTEXT].identityToken;
  let userProfile = res.locals.user;

  let userAttribute;
  try {
    userAttribute = await userProfileManager.getUserInfo(accessToken, identityToken);
  } catch (e) {
    logger.error("getUserAtribute failed " + e.message);
    return deferred.reject(e);
  }
  next();

}

userAuthHandler.getUserAttributes = async (req, res, next) => {
  logger.debug("getUserAttributes");
  logger.debug(req.session[WebAppStrategy.AUTH_CONTEXT]);
  let accessToken = req.session[WebAppStrategy.AUTH_CONTEXT].accessToken;
  let identityToken = req.session[WebAppStrategy.AUTH_CONTEXT].identityToken;
  logger.debug(accessToken);
  logger.debug(identityToken);
  let attributes;
  try {
    attributes = await userProfileManager.getAllAttributes(accessToken, identityToken);
  } catch (e) {
    logger.error("getUserAtribute failed ", e);
    return deferred.reject(e);
  }
  res.locals.user.attributes = attributes;
  // TODO: uncomment following as its the actual user token generated by openidl ui
  res.locals.user.userToken = accessToken;
  userAuthHandler.setToken(identityToken)
  logger.debug('USER ATTRIBUTES');
  logger.debug(res.locals.user.attributes);
  next();

}

/**
 * get configuration on local envrionment
 */
userAuthHandler.init = (config) => {
  logger.debug("user auth handler init");
  let loginConfig = {};
  const localConfig = config;
  logger.debug("local config :" + localConfig);
  const requiredParams = ['clientId', 'secret', 'tenantId', 'oauthServerUrl', 'profilesUrl', 'managementUrl'];
  requiredParams.forEach(function (requiredParam) {
    if (!localConfig[requiredParam]) {
      console.error('When running locally, make sure to create a file *localdev-config.json* in the root directory. See config.template.json for an example of a configuration file.');
      console.error(`Required parameter is missing: ${requiredParam}`);
      process.exit(1);
    }
    loginConfig[requiredParam] = localConfig[requiredParam];
  });
  loginConfig['redirectUri'] = 'http://localhost:3000/ibm/bluemix/appid/callback';
  loginConfiguration = loginConfig;
  logger.debug('init webstrategy initialisation start');
  webAppStrategy = new WebAppStrategy(loginConfiguration);
  logger.debug('init webstrategy initialised');
  userProfileManager.init(loginConfiguration);
}

/**
 * configure standard security and HTTPS
 */
userAuthHandler.configureSSL = (req, res, next) => {
  logger.debug("configureSSL");
  if (!isLocal) {
    express_enforces_ssl();
  }
  next();
}

/**
 * logout user from appID
 */
userAuthHandler.logout = (req, res, next) => {
  WebAppStrategy.logout(req);
  res.clearCookie("refreshToken");
  next();
}

/**
 * logout user from appID
 */
userAuthHandler.logout = (req, res, next) => {
  WebAppStrategy.logout(req);
  next();
}

module.exports = userAuthHandler;
