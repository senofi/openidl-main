const FileStorageFactory = require('./storage');
const fileStorageClient = FileStorageFactory.getInstance();

module.exports = {
    fileStorageClient
}