#!/usr/local/bin/node

//
// given a azure queue on the cmd line, we turn that string into an azure reference
// and get / delete every message in the queue
//
const dotenv = require('dotenv').config()

const {
    Aborter,
    QueueURL,
    MessagesURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require("@azure/storage-queue"); // Change to "@azure/storage-queue" in your package

//
// this is an older javascript lib for connecting to Azure, but this is what the Azure
// web examples are written in
//
Storage = require('azure-storage')
let urlLinks = []
//
// function starts here!
//
if (process.argv.length < 3) {
    console.error("usage: func queue-name")
    return -1
}
main(process.argv[2])
    .then(() => {
        
    })
    .catch(err => {
        console.error(err)
    })

async function main(queueName) {

    // Enter your storage account name and shared key
    // in the environment
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    const queueSvc = Storage.createQueueService(accountConnectionString)
    queueSvc.getQueueMetadata(queueName, async function (error, metaData) {
        if (metaData) {
            // console.log(metaData.approximateMessageCount)
            for (let j = 0; j < metaData.approximateMessageCount; j++) {
                const msg = await queueSvc.getMessages(queueName, (error, results, response) => {
                    if (!error) {
                        let msg = results[0]
                        if ( msg === null ) {
                            return 
                        }
                        let msgTxt = Buffer.from(msg.messageText, 'base64').toString('ascii')
                        console.log(msgTxt)
                        urlLinks.push(msgTxt)
                        queueSvc.deleteMessage(queueName, msg.messageId, msg.popReceipt, function (error, response) {
                            if (!error) {
                                // console.log(`message ${msg.messageId} deleted`)
                            }
                        })

                    }
                })
            }
        }
    })



}