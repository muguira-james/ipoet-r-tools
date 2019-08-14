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
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    const queueSvc = Storage.createQueueService(accountConnectionString)

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
    

    // Create a blob container reference
    const containerName = `search-${userid}-container`;

    blobService = Storage.createBlobService(accountConnectionString)
    await blobService.deleteContainer(containerName, (err) => {
        if (err) {
            console.log(`delete of container: ${containerName} failed ${err}`)
        }else {
            console.log("deleted container: ", containerName)
        }
    })
    

}