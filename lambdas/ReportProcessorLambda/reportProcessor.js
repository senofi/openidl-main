
const { getLogger } = require('loglevel');
const S3BucketManager = require('./aws-module.js');
const mongoConfig = require('config/mongoconfig.json');
const s3Config = require('./config/s3-bucket-config.json');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(mongoConfig.simpleUri);
const resultDocId = "result-123456789-1-2022-07";
const getDataCall = require('./dataCallCRUD').getDatacall;
const updateDataCall = require('./dataCallCRUD').updateDatacall;

class ReportProcessor {
	async putS3Result() {
		const s3b = new S3BucketManager();
		const input = new Object();
		input._id = resultDocId
		const arr = []
		arr.push({ VinHash: "0123", "TransactionMonth": "2022-07" })
		arr.push({ VinHash: "0456", "TransactionMonth": "2022-06" })
		arr.push({ VinHash: "0789", "TransactionMonth": "2022-06" })
		input.records = arr;
		try {
			await s3b.saveTransactionalData(input);
		} catch (err) { console.log("error!!!", err) }
	}
	async readResult(key) {
		const s3b = new S3BucketManager();
		let data;
		try {
			data = await s3b.getTransactionalData(key);
			console.log("data: ", JSON.stringify(JSON.parse(data.Body)));
		} catch (err) { console.log("error!!!", err) }
		return JSON.parse(data.Body);
	}
	async readDMVData(transactionMonth) {
		try {
			//use dummy data until the dmvdata is populated
			// const result = [
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "012345678901234567",
			// 		"VinHash": "0123",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-01",
			// 		"TransactionMonth": "2022-07"
			// 	},
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "012345678901234568",
			// 		"VinHash": "0234",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-21",
			// 		"TransactionMonth": "2022-07"
			// 	},
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "012345678901234569",
			// 		"VinHash": "0345",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-21",
			// 		"TransactionMonth": "2022-07"
			// 	},
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "01234567890123456A",
			// 		"VinHash": "0456",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-21",
			// 		"TransactionMonth": "2022-07"
			// 	},
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "01234567890123456B",
			// 		"VinHash": "0567",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-30",
			// 		"TransactionMonth": "2022-07"
			// 	},
			// 	{
			// 		"Organization ID": "0111",
			// 		"VIN": "01234567890123456C",
			// 		"VinHash": "0678",
			// 		"State": "ND",
			// 		"Transaction Date": "2022-06-31",
			// 		"TransactionMonth": "2022-07"
			// 	}
			// ];
			// return result;
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
				console.log("No documents found!");
			}
			const result = await cursor.toArray();
			console.log("-----DMV data: ", result)
			return result;

		} catch (err) { console.log("error!!!", err) }
		finally {
			await client.close();
		}
	}

	async createReportContent(resultData, dmvData) {
		const reportData = [];
		console.log("---DMVDATA type: ", typeof dmvData)
		console.log("---DMVDATA length: ", dmvData.length)
		console.log("---DMVDATA 1: ", dmvData[1])
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
		console.log("-----reportData: ", reportData);
		return reportData
	}

async publishCSV(data, datacallId) {
	const s3b = new S3BucketManager();
	try {
		await s3b.uploadCSV(data, datacallId);
	} catch (err) { console.log("error!!!", err) }
}

	async getCSV(id) {
		const s3b = new S3BucketManager();
		try {
			await s3b.getCSV(id);
		} catch (err) { console.log("error!!!", err) }
	}
}

module.exports = ReportProcessor;