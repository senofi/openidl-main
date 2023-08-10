const FileStorageFactory = require('./storage/file-storage-factory');
const fileStorageClient = FileStorageFactory.getInstance();
const uuid = require('uuid/v4');
const fs = require('fs');
const stream = require("stream");

const inputObject = {
    _id: uuid(),
    records: [{"test": "test"}]
}

const mainBody = [{"test": "test"}]

// fileStorageClient.saveTransactionalData(inputObject)

const s3FileStorage = FileStorageFactory.getInstanceWithParam('AWS');
const azureFileStorage = FileStorageFactory.getInstanceWithParam('AZURE');

const id = `senofi-${uuid()}`
const streamId = `senofi-stream-${uuid()}`

const testFunction = async () => {

// TEST S3
    await s3FileStorage.saveObject(id, mainBody).then((data) => {
        console.log('S3 data: ', data)
    }).catch((err) => {
        console.log('S3 err: ', err)
    })

    const s3Stream = new stream.Readable.from(JSON.stringify(mainBody))

    await s3FileStorage.uploadStream(streamId, s3Stream).then((data) => {
        console.log('S3 stream data: ', data)
    }).catch((err) => {
        console.log('S3 stream err: ', err)
    })

    await s3FileStorage.getObjectById(id).then((data) => {
        console.log('S3 get data: ', data)
    }).catch((err) => {
        console.log('S3 get err: ', err)
    })

    await s3FileStorage.getObjectsByPrefix('senofi').then((data) => {
        console.log('S3 get objects data: ', data)
    }).catch((err) => {
        console.log('S3 get objects err: ', err)
    })

    await s3FileStorage.deleteObject(id).then((data) => {
        console.log('S3 delete data: ', data)
    }).catch((err) => {
        console.log('S3 delete err: ', err)
    })

// TEST AZURE
    await azureFileStorage.saveObject(id, mainBody).then((data) => {
        console.log('Azure data: ', data)
    }).catch((err) => {
        console.log('Azure err: ', err)
    })

    const azureStream = new stream.Readable.from(JSON.stringify(mainBody))

    await azureFileStorage.uploadStream(streamId, azureStream).then((data) => {
        console.log('Azure stream data: ', data)
    }).catch((err) => {
        console.log('Azure stream err: ', err)
    })

    await azureFileStorage.getObjectById(id).then((data) => {
        console.log('Azure get data: ', data)
    }).catch((err) => {
        console.log('Azure get err: ', err)
    })

    await azureFileStorage.getObjectsByPrefix('senofi-stream').then((data) => {
        console.log('Azure get objects data: ', data)
    }).catch((err) => {
        console.log('Azure get objects err: ', err)
    })

    await azureFileStorage.deleteObject(id).then((data) => {
        console.log('Azure delete data: ', data)
    }).catch((err) => {
        console.log('Azure delete err: ', err)
    })
}

testFunction();

module.exports = {
    fileStorageClient
}