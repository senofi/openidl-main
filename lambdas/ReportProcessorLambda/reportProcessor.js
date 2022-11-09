const config = require('config');
const  logger  = require('loglevel');
logger.setLevel(config.get('loglevel'));
const S3BucketManager = require('./aws-module.js');
class ReportProcessor {
	async readResult(params) {
		const s3b = new S3BucketManager();
		let data;
		try {
			data = await s3b.getTransactionalData(params);
			data = JSON.parse(data.Body);
      const buff = Buffer.from(data[0].data);
			const dataString = buff.toString();
			return JSON.parse(dataString);
		} catch (err) {
			logger.error("Error in reading result: ", err)
		}
	}

	async createReportContent(resultData, dmvData) {
		const reportData = [];
		for (var i = 0; i < dmvData.length; i = i + 1) {
			var isInsured = "no";
			for (var j = 0; j < resultData.length; j = j + 1) {
				if (dmvData[i].VINHash == resultData[j]._id) {
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
