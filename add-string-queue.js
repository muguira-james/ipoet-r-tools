#!/usr/local/bin/node

const dotenv = require('dotenv').config()

Storage = require('azure-storage')

const sample = "uid=1&ss="
//
// function starts here!
//
if (process.argv.length < 5) {
    console.error('usage: func queue-name userid googlestring')
    return -1
}
const queueName = process.argv[2]
const userid = process.argv[3]
const googlestring = process.argv[4]

main(queueName, userid, googlestring)
    .then( () => {

    })
    .catch(err => {
        console.error(err)
    })

async function main(queueName, userid, searchString) {
    
    // Enter your storage account name and shared key
    const accountConnectionString = process.env.STORAGE_CONN_STRING

    const queueSvc = Storage.createQueueService(accountConnectionString)
    const s64 = Buffer.from(searchString).toString('base64')
    let searchInfo = `uid=${userid}&ss=${s64}`

    let messageObject = Buffer.from(searchInfo).toString('base64')
    console.log("----------")
    console.log("queueName = ", queueName)
    console.log("userid = ", userid)
    console.log("search string = ", searchString)
    console.log("----------")

    queueSvc.createMessage(queueName, messageObject, (error, results, response) => {
        if ( !error ) {
            console.log(`QueueName: ${queueName}`)
            console.log(`message enqueued: ${searchInfo}`)
        }
    })
    // const frontDoor = 'front-door-ipoet'
    // queueSvc.createMessage(frontDoor, messageObject, (error, results, response) => {
    //     if ( !error ) {
    //         console.log(`QueueName: ${queueName} : message enqueued: ${searchInfo} number 2 return: ${searchInfo.number2retrieve}`)
    //     }
    // })
    


}