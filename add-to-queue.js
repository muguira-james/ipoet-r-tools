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

let number2retrieve = 20
//
// function starts here!
//
if (process.argv.length < 5) {
    console.error('usage: func queue-name userid searchstring [ optional: number2retrieve ]')
    return -1
}
if ( process.argv[5]) {
    number2retrieve = process.argv[5]
}
main(process.argv[2], process.argv[3], process.argv[4], number2retrieve)
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })

async function main(queueName, userid, searchString, number2retrieve) {
    
    // Enter your storage account name and shared key
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    const queueSvc = Storage.createQueueService(accountConnectionString)

    let searchInfo = {}
    searchInfo.userid = userid
    searchInfo.searchstring = searchString
    searchInfo.number2retrieve = number2retrieve

    let messageObject = Buffer.from(JSON.stringify(searchInfo)).toString('base64')
    console.log(searchInfo)
    queueSvc.createMessage(queueName, messageObject, (error, results, response) => {
        if ( !error ) {
            console.log(`QueueName: ${queueName} : message enqueued: ${searchInfo} number 2 return: ${searchInfo.number2retrieve}`)
        }
    })

    


}