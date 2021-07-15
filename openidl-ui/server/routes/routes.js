'use strict';
const express = require('express');
const app = express();
const openidlCommonApp = require('../../../openidl-common-ui/server/index');
const userAuthHandler = openidlCommonApp.UserAuthHandler;
const apiAuthHandler = openidlCommonApp.ApiAuthHandler;
const cognitoAuthHandler = openidlCommonApp.CognitoAuthHandler;
const commonController = require('../controllers/common');
const NODE_ENV = process.env.NODE_ENV || 'development';
const router = express.Router();
const API_URL = '/api';
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// for local development, UI will use 4200 port and API will use 8080
// if (NODE_ENV !== 'production') {
//     API_URL = "";
// }

//module.exports = function(app) {
// Application Login
router.route(API_URL + '/login').post(userAuthHandler.authenticate, userAuthHandler.getUserAttributes, apiAuthHandler.getApiToken, commonController.login);
// /userAuthHandler.authenticate, userAuthHandler.getUserAttributes, apiAuthHandler.getApiToken, userAuthHandler.storeTokenInCookie,

// Application logout
router.route(API_URL + '/logout').post(userAuthHandler.logout, commonController.logout);

// Get data calls according to the params passed eg: status, page index etc
router.route(API_URL + '/list-data-calls-by-criteria').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCalls);

// Get LOBs
router.route(API_URL + '/lob').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLOBs);

// Get Block history
router.route(API_URL + '/block-explorer').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getBlockHistory);

// Data call related tasks such as create, update etc
router.route(API_URL + '/data-call').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.dataCall);

/**
 * Search data call based on wildcard string
 */
router.route(API_URL + '/search-data-calls').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getSearchDataCalls);

// Get draft version
router.route(API_URL + '/data-call-versions/:id').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.dataCallVersions);

// Get like status
router.route(API_URL + '/like-status-data-call/:id/:version/:orgid').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLikeStatus);

// Get consent status
router.route(API_URL + '/consent-status-data-call/:id/:version/:orgid').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getConsentStatus);

// Get Consent Count
router.route(API_URL + '/consent-count/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getConsentCount);

// Get Like Count
router.route(API_URL + '/like-count/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getLikeCount);

// Save and issue a data call
router.route(API_URL + '/save-and-issue-data-call').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.saveAndIssue);

// Issue a data call
router.route(API_URL + '/issue-data-call').put(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.issue);

// Save new draft
router.route(API_URL + '/save-new-draft').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.saveNewDraft);

// Update data call
router.route(API_URL + '/data-call').put(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.dataCall);
router.route(API_URL + '/update-data-call').put(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.updateDataCall);

// Like / Unlike a data call
router.route(API_URL + '/like').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.likeUnlikeDataCall);

// List likes
router.route(API_URL + '/list-likes-by-data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.listLikes);

// List Consents
router.route(API_URL + '/list-consents-by-data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.listConsents);

// Get Reports
router.route(API_URL + '/report').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getReport);

// Update Report
router.route(API_URL + '/report').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.updateReport);

// Update Report
router.route(API_URL + '/report').put(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.updateReport);

// Provide consent to a data call
router.route(API_URL + '/consent').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.provideConsent);

// Get data call details
router.route(API_URL + '/data-call/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCallDetails);

// Get data call history
router.route(API_URL + '/data-call-log/:id/:version').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getDataCallHistory);

router.route(API_URL + '/reset-data').delete(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.resetData);

router.route(API_URL + '/list-extraction-patterns').get(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getExtrationPattern);

router.route(API_URL + '/extraction-patterns').post(userAuthHandler.isLoggedIn, userAuthHandler.getUserRole, apiAuthHandler.authenticate, commonController.getExtractionPatternsById);

module.exports = router;
//}