#!/usr/bin/node

const dotenv = require('dotenv').config()

const {
    Aborter,
    ServiceURL,
    StorageURL,
    QueueURL,
    SharedKeyCredential,
} = require("@azure/storage-queue"); // Change to "@azure/storage-queue" in your package

Storage = require('azure-storage')
var blobService 

//
// function starts here!
//
if (process.argv.length < 3) {
    console.error('usage: func userid')
    return -1
}
//
// inputs: userid
main(process.argv[2])
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })



async function main(userid) {
    
    // Enter your storage account name and shared key
    const account = process.env.STORAGE_ACCT_NAME
    const accountKey = process.env.STORAGE_ACCT_KEY

    // Use SharedKeyCredential with storage account and account key
    const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(sharedKeyCredential);

    const serviceQueueURL = new ServiceURL(
        `https://${account}.queue.core.windows.net`,
        pipeline
    );

    // linking to an existing queue
    

    const queueName = `ipoet-${userid}-queue`;
    console.log(`creating queue: ${queueName}`)
    const queueURL = QueueURL.fromServiceURL(serviceQueueURL, queueName);
    const createQueueResponse = queueURL.create(Aborter.none);
    console.log(
        `Create queue ${queueName} successfully`
    );


    blobService = Storage.createBlobService(account, accountKey)
    // linking to an existing container
    

    // Create a blob container reference
    const containerName = `search-${userid}-container`;

    const result = await createContainer(containerName)
    console.log("create container status: ", result)
}

async function createContainer(containerName) {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};
