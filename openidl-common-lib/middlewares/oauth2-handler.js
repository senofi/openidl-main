const log4js = require('log4js');
const JwtStrategy = require('passport-jwt').Strategy;
const jwksRsa = require('jwks-rsa');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { UserDataStoreClientFactory } = require('../cloud-services');

const getJwtOptions = (config) => {
  return {
    jwtFromRequest: req => req.headers.authorization.replace('Bearer ', ''),
    secretOrKeyProvider: jwksRsa.passportJwtSecret({
      cache: true,
      jwksUri: `${config.issuer}/.well-known/jwks.json`,
    }),
    algorithms: ['RS256'],
    issuer: config.issuer,
  };
};

const logger = log4js.getLogger('middleware - oauth2-handler');
logger.level = process.env.LOG_LEVEL || 'debug';

// Passport session persistance
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/**
 * Auth object
 */
const jwtHandler = {};

// Configure local configuration and security
let jwtStrategy;

jwtHandler.setStrategy = (passport) => {
  passport.use(jwtStrategy);
};

jwtHandler.getStrategy = () => jwtStrategy;
jwtHandler.getPassport = () => {
  return passport;
};

jwtHandler.isLoggedIn = (req, res, next) => {
  logger.debug('isLoggedIn');

  const accessTokenString = _getAccessToken(req, next);
  logger.info(`accessTokenString  ${accessTokenString}`);
  if (!accessTokenString) {
    return res.status(500)
    .json({
      message: 'access token is not provided or invalid'
    });
  }

  next();
};

/**
 * Authenticate using passport
 */
jwtHandler.authenticate = (req, res, next) => {
  logger.debug('authHandler.authenticate ');
  logger.debug(req.body);
  logger.debug(req.headers);
  passport.authenticate('jwt', { session: false }, (err, user, info) => {

    if (info && info.name === 'TokenExpiredError') {
      return res.status(401)
      .json(info);
    }

    if (err || info) {
      logger.debug('if err or infor');
      logger.debug('err: ', JSON.stringify(err, null, 2));
      logger.debug('info: ', JSON.stringify(info, null, 2));
      res.status(500)
      .json({
        message: info.message,
      });
    } else {
      next();
    }
  })(req, res, next);
  console.log('asdasdasd');
};

jwtHandler.validateToken = (req, res, next) => {
  logger.info('*****************************************************************************');

  logger.info(`request.headers.host ${req.headers.host}`);

  logger.info(`request.headers.authorization ${req.headers.authorization}`);
  try {
    logger.debug(`request.headers ${JSON.stringify(req.headers)}`);
  } catch (ex) {
    logger.info(`error while parsing  req.headers ${ex}`);
  }

  logger.info(`request.body.batchID  ${req.body.batchId}`);

  logger.info(`request.body.chunkID  ${req.body.chunkId}`);

  logger.info('****************************************************************************');

  jwtHandler.authenticate(req, res, next);
};

/**
 * callback handler
 */
jwtHandler.callback = (req, res, next) => {
  logger.debug('authHandler.callback');
  passport.authenticate('jwt', {
    failureRedirect: '/error',
    failureFlash: true,
    allowAnonymousLogin: false,
  });
  next();
};
/**
 * Store token in cookie
 */
jwtHandler.storeRefreshTokenInCookie = (req, res, next) => {
  logger.debug('storeRefreshTokenInCookie');
  if (req.session.passport && req.session.passport.user && req.session.passport.user.refreshToken) {
    const refreshToken = req.session.passport.user.refreshToken;
    logger.debug('refreshing cookie');
    /* An example of storing user's refresh-token in a cookie with expiration of a month */
    res.cookie('refreshToken', refreshToken, {
      maxAge: 2 * 60 * 60 * 1000, /* 30 days */
    });
  }
  next();
};

jwtHandler.storeTokenInCookie = (req, res, next) => {
  if (req.session) {
    res.cookie('accessToken', req.session.passport.user.accessToken);
  }
  next();
};

jwtHandler.getUserAttributes = async (req, res, next) => {
  logger.debug('getUserAttributes');

  const accessTokenString = _getAccessToken(req);
  const tokenPayload = jwt.decode(accessTokenString);
  const username = tokenPayload.username;

  const userDataStore = await UserDataStoreClientFactory.getInstance();
  const userAttributes = await userDataStore.getUserByUsername(username);

  res.locals.user.attributes = userAttributes;
  res.locals.user.userToken = req.session.passport.user.accessTokenString;
  next();
};

/**
 * Get the user role
 */
jwtHandler.getUserRole = async (req, res, next) => {
  const accessTokenString = _getAccessToken(req);
  const tokenPayload = jwt.decode(accessTokenString);
  const username = tokenPayload.username;

  const userDataStoreClient = await UserDataStoreClientFactory.getInstance();
  const userAttributes = await userDataStoreClient.getUserByUsername(username);
  console.log('userAttributes: ', JSON.stringify(userAttributes));
  res.locals.role = userAttributes.role;

  if (!res.locals.role) {
    logger.error('getUserAtribute failed. Role is missing.');
    res.status(401)
    .send('Unauthorized');
  }

  if (res.locals.role === 'regulator') {
    logger.debug('Juridiction');
    logger.debug(res.locals.juridiction);
    res.locals.juridiction = userAttributes.stateName;
  } else {
    logger.debug('Juridiction');
    logger.debug(res.locals.juridiction);
    res.locals.juridiction = userAttributes.organizationId.split(' ')[0];
  }
  next();
};

/**
 * get configuration on local envrionment
 */
jwtHandler.init = (config) => {
  logger.debug('user auth handler init');

  logger.debug(`local config :${config}`);

  jwtStrategy = new JwtStrategy(getJwtOptions(config), (jwtPayload, done) => {
    if (!jwtPayload) {
      return done(null, false, { message: 'Invalid token' });
    }

    return done(null, jwtPayload); // If valid, jwtPayload is passed to next request handler
  });

  logger.debug('init webstrategy initialised');
};

/**
 * logout user from cognito
 */
jwtHandler.logout = (req, res, next) => {
  if (req.session && req.session.passport) {
    delete req.session.passport.user;
  }
  res.clearCookie('refreshToken');
  next();
};

// Helper method to retrieve access token from a request header
const _getAccessToken = (req, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const authHeaderComponents = authHeader.split(' ');
      if (authHeaderComponents[0].indexOf('Bearer') !== 0) {
        logger.error('Payload structure deosn\'t have Bearer token ');
        return null;
      }
      logger.info('=============================================================');

      logger.info(`[authHeaderComponents.lemgth  ${authHeaderComponents.length}`);

      logger.info(`[authHeaderComponents[0] ${authHeaderComponents[0]}`);

      logger.info(`[authHeaderComponents[1] ${authHeaderComponents[1]}`);

      logger.info('=============================================================');
      if (authHeaderComponents.length !== 2 && authHeaderComponents.length !== 3) {
        logger.error('Malformed authorization header other error');
        return null;
      }
      return authHeaderComponents[1];
    }
    logger.error('Payload structure deosn\'t have authroization element ');
    return null;
  } catch (error) {
    logger.error(`Payload structure deosn't have authroization token ${error}`);
    return null;
  }
};

module.exports = jwtHandler;
