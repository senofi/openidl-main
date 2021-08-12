
'use strict';
/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const log4js = require('log4js');
const logger = log4js.getLogger('helpers - hashicorpvaultwallet');
logger.level = process.env.LOG_LEVEL || 'debug';


/**
 * This class defines an implementation of an Identity wallet that persists
 * to HashiCorpVault
 *
 * @class
 */
class HashiCorpVault {

	/**
	 * Creates an instance of the HashiCorpVault
	 */
	constructor() {
	}

	async loadoptions(options) {
		logger.info("in loadoptions");
		if (!options) {
			throw new Error('No options given');
		}
		if (!options.url) {
			throw new Error('No url given');
		}
		if (!options.apiVersion) {
			throw new Error('No apiVersion given');
		}
		if (!options.roleId) {
			throw new Error('No roleId given');
		}
		if (!options.secretId) {
			throw new Error('No secretId given');
		}
		if (!options.vaultPath) {
			throw new Error('No vaultPath given');
		}
		options.vault = require("node-vault")({
			apiVersion: options.apiVersion,
			endpoint: options.url
		});
		this.options = options;
	}

	async get(label) {
		logger.info("in get");
		try {
			let id;
			let identity;
			const result = await this.options.vault.approleLogin({
				role_id: this.options.roleId,
				secret_id: this.options.secretId,
			});
			this.options.vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.
			try {
				const { data } = await this.options.vault.read(`${this.options.vaultPath}/${label}`);
				id = data.data.id;
				identity = data.data.data;
				console.log({
					id,
					identity,
				});
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
			const result = await this.options.vault.approleLogin({
				role_id: this.options.roleId,
				secret_id: this.options.secretId,
			});
			this.options.vault.token = result.auth.client_token;
			const data = JSON.stringify(identity);

			await this.options.vault.write(`${this.options.vaultPath}/${name}`, { "data": { "id": name, "data": data }})
				.then(console.log("successfully import the secret"))
				.catch(console.error);
		} catch (err) {
			console.error(err)
		}
	}
}
module.exports.HashiCorpVault = HashiCorpVault;