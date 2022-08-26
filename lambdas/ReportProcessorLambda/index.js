console.log('Loading function');

const aws = require('aws-sdk');
const ReportProcessor = require('./reportProcessor');
const getDataCall = require('./dataCallCRUD').getDatacall;
const updateDataCall = require('./dataCallCRUD').updateDatacall;

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


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
        // 1. Get the datacall id from key name
        // 2. Read the data call and get transaction month, to be used in filtering DMV data
        
        console.log("bucket name: ", bucket)
        console.log("key name: ", key)
        const datacallId = key.substring(key.indexOf("-")+1, key.length);
        console.log("datacall Id: ", datacallId)
        const getDatacallResult = await getDataCall(datacallId);
        const datacalls = JSON.parse(getDatacallResult.result);
        const datacall = datacalls[0];
        console.log('datacall found:  ', typeof datacall, ", " , JSON.stringify(datacall, null, 2));
        const transactionMonth = datacall.transactionMonth;
        console.log("transactionMonth: ", transactionMonth)
        const rp = new ReportProcessor;
        const resultData = await rp.readResult(key);
        console.log("---------readResult Done, ", JSON.stringify(resultData))
        const dmvData = await rp.readDMVData(transactionMonth);
        console.log("---------readDMVData Done, ", JSON.stringify(dmvData))
        const reportContent = await rp.createReportContent(resultData, JSON.parse(JSON.stringify (dmvData)));
        console.log("---------createReportContent Done ", JSON.stringify(reportContent))
        await rp.publishCSV(reportContent, datacallId);
        console.log("---------publishCSV Done")
        await rp.getCSV("report-" + datacallId + ".csv");
        console.log("---------getCSV Done")
        datacall.reportUrl = s3Config.urlPrefix + s3Config.bucketName + "/report-" + datacallId + ".csv";
        console.log("report url is: ", datacall.reportUrl)
        await updateDataCall(JSON.stringify(datacall));
        console.log("---------updateDtacall done, ")
        const getDatacallResult1 = await getDataCall(datacallId);
        console.log("---------getDatacall done, ", getDatacallResult1)
        return ;
    } catch (err) {
        console.log(err);
        const message = `Error!! getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};
