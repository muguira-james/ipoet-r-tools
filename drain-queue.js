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
    const account = process.env.STORAGE_ACCT_NAME
    const accountKey = process.env.STORAGE_ACCT_KEY

    const queueSvc = Storage.createQueueService(account, accountKey)
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