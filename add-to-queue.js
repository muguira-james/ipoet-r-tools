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
if (process.argv.length < 5) {
    console.error('usage: func queue-name userid searchstring')
    return -1
}
main(process.argv[2], process.argv[3], process.argv[4])
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })

async function main(queueName, userid, searchString) {
    
    // Enter your storage account name and shared key
    const account = process.env.STORAGE_ACCT_NAME
    const accountKey = process.env.STORAGE_ACCT_KEY

    const queueSvc = Storage.createQueueService(account, accountKey)
    let searchInfo = {}
    searchInfo.userid = userid
    searchInfo.searchstring = searchString
    let messageObject = Buffer.from(JSON.stringify(searchInfo)).toString('base64')
    console.log(searchInfo)
    queueSvc.createMessage(queueName, messageObject, (error, results, response) => {
        if ( !error ) {
            console.log("message enqueued: ", searchInfo)
        }
    })

    


}