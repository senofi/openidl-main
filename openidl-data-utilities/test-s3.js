// const fs = require('fs');
// const config = require('./server/config/default.json');
// const InstanceFactory = require('./server/middleware/instance-factory');
const insuranceData = {
    _id: Date.now().toString(),
    records: [
        {
            zip: 11111,
            totalPremimum: 700
        }
    ]
}
const input = insuranceData
// async function runTest() {
//     try {
//         console.log("runTest")
//         const factoryObject = new InstanceFactory();
//         let targetObject = await factoryObject.getInstance(config.insuranceDataStorageEnv);
//         await targetObject.saveTransactionalData(insuranceData);            
//     } catch (error) {
//         console.log(error)
//     }    
// }

// runTest()

var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAS7AHDH54C6OD5LDC',
    secretAccessKey: '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'
});

s3 = new AWS.S3();
let insertObjectParam = { Bucket: 'openidl-analytics-dev-ep-output', Key: input._id, Body: JSON.stringify(input.records) };
// s3.listBuckets(function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

s3.putObject((insertObjectParam), (err, data) => {
    if (err) {
        console.log(err)

    } else {
        console.log('Records Inserted Successfully');
    }
});