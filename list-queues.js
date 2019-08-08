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
if (process.argv.length < 2) {
    console.error("usage: func ")
    return -1
}
main()
    .then(() => {
        
    })
    .catch(err => {
        console.error(err)
    })

async function main() {

    // Enter your storage account name and shared key
    // in the environment
    const account = process.env.STORAGE_ACCT_NAME
    const accountKey = process.env.STORAGE_ACCT_KEY

    const queueSvc = Storage.createQueueService(account, accountKey)
    queueSvc.listQueuesSegmented(null, function(error, results, response){
        if(!error){
          console.log(results)
        }
      });



}