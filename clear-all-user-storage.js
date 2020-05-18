#!/usr/local/bin/node

const dotenv = require('dotenv').config()


Storage = require('azure-storage')


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
    

    let queueFinishName = `ipoet-${userid}-finish-queue`
    // console.log("deleting queue = ", queueName)
    queueSvc.deleteQueue(queueFinishName, async function(err, response) {
        if ( !err) {
            console.log(`Queue ${queueFinishName} has been deleted`)
        }
    })
    
    const queueAdvName = `adv-finish-${userid}-queue`
     // console.log("deleting queue = ", queueName)
     queueSvc.deleteQueue(queueAdvName, async function(err, response) {
        if ( !err) {
            console.log(`Queue ${queueAdvName} has been deleted`)
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
    const containerAdvName = `advsearch-${userid}-container`
    await blobService.deleteContainer(containerAdvName, (err) => {
        if (err) {
            console.log(`delete of container: ${containerAdvName} failed ${err}`)
        }else {
            console.log("deleted container: ", containerAdvName)
        }
    })
}