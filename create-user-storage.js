#!/usr/local/bin/node

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


    const queueName = `ipoet-${userid}-queue`;
    console.log(`creating queue: ${queueName}`)
    queueSvc.createQueueIfNotExists(queueName, (err, results, resp) => {
        if (err) {
            console.log(`Queue create failed: ${queueName}`, err)
        } else {
            console.log(`Queue created or already exists: ${queueName}`)
        }
    })

    const queueFinishName = `ipoet-${userid}-search-queue`;
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

    const result = await createContainer(containerName)
    console.log("create container status: ", result)
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
