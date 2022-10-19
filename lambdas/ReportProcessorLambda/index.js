const aws = require('aws-sdk');
const config = require('config');
const logger = require('loglevel');
logger.setLevel(config.get('loglevel'));
const s3Config = require('./config/s3-bucket-config.json');
const ReportProcessor = require('./reportProcessor');
const getDataCall = require('./dataCallCRUD').getDatacall;
const updateDataCall = require('./dataCallCRUD').updateDatacall;
const getReport = require('./dataCallCRUD').getReport;
const postReport = require('./dataCallCRUD').postReport;
const getDMVData = require('./dataCallCRUD').getDMVData;

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        logger.debug("bucket name: ", bucket)
        logger.debug("key name: ", key)
        const datacallId = key.substring(key.indexOf("-")+1, key.length);
        logger.debug("Datacall Id: ", datacallId);
        const getDatacallResult = await getDataCall(datacallId);
        const datacalls = JSON.parse(getDatacallResult.result);
        const datacall = datacalls[0];
        const transactionMonth = datacall.transactionMonth;
        logger.debug("Datacall fetched from Blockchain with id: ", datacallId)
        const rp = new ReportProcessor;
        const resultData = await rp.readResult(params);
        logger.debug("Result data is: ", JSON.stringify(resultData, null, 2))
        const dmvData = await getDMVData(config.get("DMVOrganizationId"), transactionMonth);
        logger.debug("Data reading Done from DMV data and result")
        const reportContent = await rp.createReportContent(resultData, JSON.parse(JSON.stringify (dmvData)));
        await rp.publishCSV(reportContent, datacallId);
        await rp.getCSV("report-" + datacallId + ".csv");
        const reportUrl = "" + s3Config.urlPrefix + s3Config.bucketName + "/report-" + datacallId + ".csv";
        const report = {
            "datacallID": datacallId,
            "dataCallVersion": datacall.version,
            "hash": "examplehash123",
            "url": reportUrl,
            "createdTs": new Date().toISOString(),
            "createdBy": datacallConfig.username
            }; 
        await postReport(JSON.stringify(report));
        logger.info("Report published in CSV and Blockchain updated")
        return ;
    } catch (err) {
        logger.error("Error in report processor!", err)
        throw new Error(err);
    }
};
