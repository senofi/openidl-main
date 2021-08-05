
'use strict';
/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const log4js = require('log4js');
const BaseWallet = require('fabric-network/lib/impl/wallet/basewallet');
const logger = log4js.getLogger('helpers - hashicorp vault');
/**
 * This class defines an implementation of an Identity wallet that persists
 * to a IBM certificate manager
 *
 * @class
 * @extends {BaseWallet}
 */
class HashiCorpVault extends BaseWallet {

	/**
	 * Creates an instance of the CertificatemanagerWallet
	 * @param {Object} options contains required property <code>url</code> and other Nano options
	 * @param {WalletMixin} mixin
	 * @memberof CertificatemanagerWallet
	 */
	constructor() {
		super();
		this.CMOptions = {};
	}

	async loadoptions(options) {

		if (!options) {
			throw new Error('No options given');
		}
		if (!options.url) {
			throw new Error('No url given');
		}
		if (!options.apiVersion) {
			throw new Error('No apiVersion given');
		}

		options.vault = require("node-vault")({
			apiVersion: options.apiVersion,
			endpoint: options.url
		});

		this.options = options;

		Object.assign(this.CMOptions, this.options);
	}

	async exists(label) {
		try {
			const result = await this.CMOptions.vault.approleLogin({
				role_id: process.env.ROLE_ID,
				secret_id: process.env.SECRET_ID,
			});
			this.CMOptions.vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

			const { data } = await this.CMOptions.vault.read("secret/data/mysql/webapp"); // Retrieve the secret stored in previous steps.
			const id = data.data.id;
			if (label === id) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			logger.error(e);
			if (e.response.statusCode === 404) {
				// when no secret found -> will come to this err block and return false
				logger.debug("no secret found")
				return false;
			} else { throw e.response; }
		}
	}

	async export(label) {
		try {
			const result = await this.CMOptions.vault.approleLogin({
				role_id: process.env.ROLE_ID,
				secret_id: process.env.SECRET_ID,
			});
			this.CMOptions.vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

			const { data } = await this.CMOptions.vault.read("secret/data/mysql/webapp"); // Retrieve the secret stored in previous steps.
			const id = data.data._id;
			const identity = data.data.data;
			console.log({
				id,
				identity,
			});
			if (label === id) {
				return identity;
			} else {
				throw new Error('label/id not match')
			}
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async import(name, identity) {
		try {
			const result = await this.CMOptions.vault.approleLogin({
				role_id: process.env.ROLE_ID,
				secret_id: process.env.SECRET_ID,
			});
			this.CMOptions.vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

			const data = this.identityBuilder(name, identity);

			await this.CMOptions.vault.write("secret/data/mysql/webapp", { "data": data })
				.then(console.log("successfully import the secret"))
				.catch(console.error);
		} catch (err) {
			console.error(err)
		}
	}

	identityBuilder(id, identity) {
		let credentials = {
			"certificate": identity.certificate,
			"privateKey": identity.privateKey
		};

		let data = {
			credentials: credentials,
			mspId: identity.mspId,
			type: "X.509",
			version: 1
		}

		return {
			"_id": id,
			"data": JSON.stringify(data)
		}
	}

}
module.exports.HashiCorpVault = HashiCorpVault;