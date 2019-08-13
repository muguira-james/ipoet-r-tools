#!/usr/bin/node

const dotenv = require('dotenv').config()

const {
    Aborter,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require("@azure/storage-queue"); // Change to "@azure/storage-queue" in your package

Storage = require('azure-storage')
const { ContainerURL } = require('@azure/storage-blob')

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

    const queueSvc = Storage.createQueueService(account, accountKey)
    let queueName = `ipoet-${userid}-queue`
    // console.log("deleting queue = ", queueName)
    queueSvc.deleteQueue(queueName, async function(err, response) {
        if ( !err) {
            console.log(`Queue ${queueName} has been deleted`)
        }
    })
    

     //
    // delete all blobs in container
    //
    

    // Use SharedKeyCredential with storage account and account key
    const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(sharedKeyCredential);

    // setup the referenece to the blob container
    const serviceURL = new ServiceURL(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        pipeline
    );
    
    // linking to an existing container
    

    // Create a blob container reference
    const containerName = `search-${userid}-container`;
    // console.log(`deleting container--> ${containerName}`)
    
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
    
    const aborter = Aborter.timeout(30 * 60);
    await containerURL.delete(aborter)
    
    console.log("deleted container: ", containerName)

}