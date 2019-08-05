#!/usr/local/bin/node

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
    const account = process.env.STORAGE_ACCT_NAME
    const accountKey = process.env.STORAGE_ACCT_KEY

    const queueSvc = Storage.createQueueService(account, accountKey)

    queueSvc.getQueueMetadata(queueName, function(error, metaData) {
        if (error) {
            console.error(error)
            return -1
        }
        console.log(metaData.approximateMessageCount)
    })
    


}