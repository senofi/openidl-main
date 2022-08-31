const config = require('config');
const  logger  = require('loglevel');
logger.setLevel(config.get('loglevel'));
const S3BucketManager = require('./aws-module.js');
const mongoConfig = require('config/mongoconfig.json');
const s3Config = require('./config/s3-bucket-config.json');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(mongoConfig.simpleUri);
class ReportProcessor {
	async readResult(key) {
		const s3b = new S3BucketManager();
		let data;
		try {
			data = await s3b.getTransactionalData(key);
			return JSON.parse(data.Body);
		} catch (err) {
			logger.error("Error in reading result: ", err)
		}
	}
	async readDMVData(transactionMonth) {
		try {
			const db = client.db(mongoConfig.mongodb);
			const coll = db.collection(mongoConfig.collection)
			const query = { TransactionMonth: transactionMonth };
			const options = {
				// sort matched documents in descending order by rating
				// sort: { "_id": -1 },
				// Include only some fields in the returned document
				projection: { _id: 0, VinHash: 1, VIN: 1 },
			};
			const cursor = coll.find(query, options);

			if ((await cursor.count()) === 0) {
				throw new Error("No DMV documents found!");
			}
			const result = await cursor.toArray();
			return result;

		} catch (err) {
			logger.error("Error during Read DMV data", err)
		}
		finally {
			await client.close();
		}
	}

	async createReportContent(resultData, dmvData) {
		const reportData = [];
		for (var i = 0; i < dmvData.length; i = i + 1) {
			var isInsured = "no";
			for (var j = 0; j < resultData.length; j = j + 1) {
				if (dmvData[i].VinHash == resultData[j].VinHash) {
					isInsured = "yes";
					break;
				}
			}
			const row = { "vin": dmvData[i].VIN, "isInsured": isInsured };
			reportData.push(row);
		}
		return reportData
	}

	async publishCSV(data, datacallId) {
		const s3b = new S3BucketManager();
		try {
			await s3b.uploadCSV(data, datacallId);
		} catch (err) {
			logger.error("Error in publishing CSV: ", err)
		}
	}

	async getCSV(id) {
		const s3b = new S3BucketManager();
		try {
			await s3b.getCSV(id);
		} catch (err) {
			logger.error("Error in getting CSV: ", err)
		}
	}
}

module.exports = ReportProcessor;