#!/usr/bin/node

const dotenv = require('dotenv').config()


Storage = require('azure-storage')
var blobService 

//
// function starts here!
//
if (process.argv.length < 2) {
    console.error('usage: func ')
    return -1
}
//
// inputs: userid
main()
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })



async function main() {
    
    // Enter your storage account name and shared key
    // const account = process.env.STORAGE_ACCT_NAME
    // const accountKey = process.env.STORAGE_ACCT_KEY
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    // blobService = Storage.createBlobService(account, accountKey)
    blobService = Storage.createBlobService(accountConnectionString)
    let c = await listContainers()
    console.log(c)
}

async function listContainers() {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} containers`, containers: data.entries });
            }
        });
    });
};
