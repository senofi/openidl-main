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
 

const request = require("request-promise");
const Q = require("q");
var appUserRegister = {}
const config = require('../app/config/app-id-credentials.json');
const appConfig = require('../app/config/app-config.json')
const log4js = require('log4js');
const logger = log4js.getLogger('app - appuser');
logger.level = appConfig.logLevel;
/**
 * Creates a user in cloud directory
 */
appUserRegister.createUserInCloudDirectory = async (usersConfig) => {
	const deferred = Q.defer();
	let users = usersConfig.users;
	var accessToken = usersConfig.authKey;
	var method = "POST"
	var url = config.managementUrl + appConfig.cloudDirectoryPath;
	logger.debug("URL >> " + url);
	logger.debug(config.managementUrl);
	var headers = {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + accessToken
	};

	for (var i = 0; i < users.length; i++) {
		var reqBody = users[i];
		logger.debug("Request > " + reqBody);
		logger.debug(reqBody);
		handleRequest(headers, reqBody, method, url, deferred, true);
	}
	return deferred.promise;
}
/**
 * Sign in the user to APPID
 */
appUserRegister.signInUserToAppId = async (usersConfig) => {
	const deferred = Q.defer();
	let users = usersConfig.users;
	logger.debug(users)
	var method = "POST"
	var url = config.oauthServerUrl + appConfig.tokenPath;
	logger.debug(new Buffer(config.clientId + ":" + config.secret).toString('base64'));
	var headers = {
		"Content-Type": "application/json",
		'Authorization': 'Basic ' + new Buffer(config.clientId + ":" + config.secret).toString('base64')
	};

	for (var i = 0; i < users.length; i++) {
		var reqBody = '{' + '"username":' + '"' + users[i].userName + '",' + '"password":' + '"' + users[i].password + '",' + '"grant_type":' + '"' + "password" + '"}';
		handleRequest(headers, reqBody, method, url, deferred, false);
	}
	return deferred.promise;
}


/**
 * Updates user profile attributes in APPID
 * No need to create user in appid as once it is signed in it is already activated in APP ID
 */
appUserRegister.updateUserProfileInAppId = async (usersConfig) => {

	const deferred = Q.defer();
	let users = usersConfig.users;

	for (var i = 0; i < users.length; i++) {
		let email = users[i].emails[0].value;
		var accessToken = usersConfig.authKey;
		let response = await getUserIdFromAppId(accessToken, email);
		logger.debug("Response>>" + response);
		let appIdUserDetails = JSON.parse(response);

		var headers = {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		};

		logger.info("Users[i] >> " + users[i]);

		var method = "PUT";

		var url = config.managementUrl + appConfig.usersPath + appIdUserDetails.users[0].id + appConfig.profilePath;
		var reqBody = JSON.stringify(users[i].profile);

		logger.info("Request" + reqBody);
		handleRequest(headers, reqBody, method, url, deferred);

	}
	return deferred.promise;
}

/**
 * Get users profile attributes using users email address
 * @param  user 
 */
async function getUserIdFromAppId(accessToken, email) {
	const deferred = Q.defer();
	var method = "GET"
	// use first and only email id
	var url = config.managementUrl + appConfig.userEmailPath + email;
	var headers = {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + accessToken
	};
	let reqBody = JSON.stringify({});
	handleRequest(headers, reqBody, method, url, deferred);
	return deferred.promise;
}
/**
 * Generic HTTP call
 * @param {*} headers 
 * @param {*} reqBody 
 * @param {*} method 
 * @param {*} url 
 * @param {*} deferred 
 * @param {*} isjson 
 */
async function handleRequest(headers, reqBody, method, url, deferred, isjson) {
	logger.debug(url)
	return request({
		url: url,
		method: method,
		body: reqBody,
		headers: headers,
		json: isjson
	}, function (err, response, body) {
		if (err) {
			logger.error(err);
			return deferred.reject(new Error("Failed to " + action));
		} else if (response.statusCode === 401 || response.statusCode === 403) {
			logger.error(err);
			return deferred.reject(new Error());
		} else if (response.statusCode === 404) {
			return deferred.reject(new Error("Not found"));
		} else if (response.statusCode === 409) {
			return deferred.reject(body);
		} else if (response.statusCode >= 200 && response.statusCode < 300) {
			return deferred.resolve(body ? body : null);
		} else {
			logger.error(err, response.headers);
			return deferred.reject(new Error("Unexpected error"));
		}
	});
}

module.exports = appUserRegister;