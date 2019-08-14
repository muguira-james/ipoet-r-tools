#!/usr/bin/node

// query the azure env to find out how many items are in the queue
//
// the queue name is passed on the command line
const dotenv = require('dotenv').config()

const {
    Aborter,
    QueueURL,
    MessagesURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require("@azure/storage-queue"); // Change to "@azure/storage-queue" in your package

Storage = require('azure-storage')
//
// function starts here!
//
if (process.argv.length < 3) {
    console.error("usage: func queue-name")
    return -1
}
main(process.argv[2])
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })

async function main(queueName) {
    
    // Enter your storage account name and shared key
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    const queueSvc = Storage.createQueueService(accountConnectionString)

    queueSvc.getQueueMetadata(queueName, function(error, metaData) {
        if (metaData) {
            console.log(metaData.approximateMessageCount)
        } else {
            console.log("errro: no info on queue: ", queueName)
        }

    })
    


}