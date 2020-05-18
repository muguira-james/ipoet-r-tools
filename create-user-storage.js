#!/usr/bin/node

const dotenv = require('dotenv').config()


Storage = require('azure-storage')
var blobService 

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

    // 1st, create the individual output queue
    const queueName = `ipoet-${userid}-queue`;
    
    console.log(`creating queue: ${queueName}`)
    queueSvc.createQueueIfNotExists(queueName, (err, results, resp) => {
        if (err) {
            console.log(`Queue create failed: ${queueName}`, err)
        } else {
            console.log(`Queue created or already exists: ${queueName}`)
        }
    })

    const queueAdvName = `adv-finish-${userid}-queue`
    console.log(`creating Adv queue: ${queueAdvName}`)
    queueSvc.createQueueIfNotExists(queueAdvName, (err, results, resp) => {
        if (err) {
            console.log(`Adv Queue create failed: ${queueName}`, err)
        } else {
            console.log(`Adv Queue created or already exists: ${queueName}`)
        }
    })
    // then create the finish queue
    const queueFinishName = `ipoet-${userid}-finish-queue`;
    console.log(`creating queue: ${queueFinishName}`)
    queueSvc.createQueueIfNotExists(queueFinishName, (err, results, resp) => {
        if (err) {
            console.log(`Queue create failed: ${queueFinishName}`, err)
        } else {
            console.log(`Queue created or already exists: ${queueFinishName}`)
        }
    })

    blobService = Storage.createBlobService(accountConnectionString)
    // linking to an existing container
    

    // Create a blob container reference
    const containerName = `search-${userid}-container`;

    const result1 = await createContainer(containerName)
    console.log("create container status: ", result1)
 
    const containerAdvName = `advsearch-${userid}-container`
    const result2 = await createContainer(containerAdvName)
    console.log("create Adv container status: ", result2)
 
}

async function createContainer(containerName) {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};
