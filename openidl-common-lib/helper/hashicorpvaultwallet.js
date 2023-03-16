
'use strict';
/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('helpers - hashicorpvaultwallet');
logger.level = process.env.LOG_LEVEL || 'debug';
const AWS = require('aws-sdk');

/**
 * This class defines an implementation of an Identity wallet that persists
 * to HashiCorpVault
 *
 * @class
 */
class HashiCorpVault {
	constructor(vaultConfig) {
        this.vaultConfig = vaultConfig;
    }

	static async loadoptions(options) {
		// configure aws
		AWS.config.update(options);
		if (!options.accessKeyId || !options.secretAccessKey || !options.roleParams) {
		throw new Error('No aws secret config given');
		}
		const sts = new AWS.STS({
		//region: 'us-east-2',
		accessKeyId: options.accessKeyId,
		secretAccessKey: options.secretAccessKey

		});
		const params = options.roleParams;

		const accessParamInfo = await sts.assumeRole(params).promise();
		logger.debug('Changed Credentials');

		const accessparams = {
		accessKeyId: accessParamInfo.Credentials.AccessKeyId,
		secretAccessKey: accessParamInfo.Credentials.SecretAccessKey,
		sessionToken: accessParamInfo.Credentials.SessionToken,
        };
		logger.info("in loadoptions");
		// initialize aws secret manager
		const awsSecretManager = new AWS.SecretsManager(accessparams);
		// get vault credentials from aws secret manager
		const vaultCredentials = await awsSecretManager.getSecretValue({ SecretId: options.secretName || 'hv-credential' }).promise();
		// parse vault configuration
		const vaultConfig = JSON.parse(vaultCredentials.SecretString);

		if (!vaultConfig) {
			throw new Error('No vaultConfig given');
		}
		if (!vaultConfig.url) {
			throw new Error('No url given');
		}
		if (!vaultConfig.apiVersion) {
			throw new Error('No apiVersion given');
		}
		if (!vaultConfig.vaultPath) {
			throw new Error('No vaultPath given');
		}
		if (!vaultConfig.username) {
			throw new Error('No username given');
		}
		if (!vaultConfig.password) {
			throw new Error('No password given');
		}
		if (!vaultConfig.orgName) {
			throw new Error('No orgName given');
		}
		// if (!vaultConfig.vaultCA) {
		// 	throw new Error('No vaultCA given');
		// }
		return new HashiCorpVault(vaultConfig);
	}

	async get(label) {
		logger.info("in get");
		try {
			let id;
			let identity;
			const nodeVault = require("node-vault")({
				apiVersion: this.vaultConfig.apiVersion,
				endpoint: this.vaultConfig.url,
				// requestOptions: {
				//     ca: fs.readFileSync(vaultConfig.vaultCA)
				// }
			});
			// login to vault to retrieve the auth token
			const result = await nodeVault.userpassLogin({
				"username": this.vaultConfig.username,
				"password": this.vaultConfig.password,
				"mount_point": this.vaultConfig.orgName
			});
			nodeVault.token = result.auth.client_token; // Add token to vault object for subsequent requests.
			try {
				const { data } = await nodeVault.read(`${this.vaultConfig.orgName}/data/${this.vaultConfig.vaultPath}/${label}`);
				// Fix to work with fabric operations console
				const {credentials, msp_id, mspId, type} = JSON.parse(data.data.data)
				const {certificate, private_key, privateKey} = credentials;
				const identityData = {
					credentials: {
						privateKey: private_key || privateKey,
						certificate
					},
					type,
					mspId: msp_id || mspId
				}
				id = data.data.id;
				identity = identityData;
			} catch (err) {
				//404 error in case secret does not exist
			}
			return label === id ? JSON.parse(identity) : undefined;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async put(name, identity) {
		logger.info("in put");
		try {
			const nodeVault = require("node-vault")({
				apiVersion: this.vaultConfig.apiVersion,
				endpoint: this.vaultConfig.url,
				// requestOptions: {
				//     ca: fs.readFileSync(vaultConfig.vaultCA)
				// }
			});
			// login to vault to retrieve the auth token
			const result = await nodeVault.userpassLogin({
				"username": this.vaultConfig.username,
				"password": this.vaultConfig.password,
				"mount_point": this.vaultConfig.orgName
			});
			nodeVault.token = result.auth.client_token;
			const data = JSON.stringify(identity);

			await nodeVault.write(`${this.vaultConfig.orgName}/data/${this.vaultConfig.vaultPath}/${name}`, { "data": { "id": name, "data": data } })
				.then(console.log("successfully import the secret"))
				.catch(console.error);
		} catch (err) {
			console.error(err)
		}
	}
}

module.exports.HashiCorpVault = HashiCorpVault;