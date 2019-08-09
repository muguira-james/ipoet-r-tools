
var request = require('request');
var rp = require('request-promise')
var cheerio = require('cheerio')

let ss= { "userid": 41, "searchstring": "US" }
const account = process.env.STORAGE_ACCT_NAME;

const accountKey = process.env.STORAGE_ACCT_KEY;


let urlLinks = []
let URL = ''
let userid = ''
let searchstring = ''

main(process.argv[2])
.then(() => {
    
})
.catch(err => {
    console.error(err)
})

// 
// uses a pre-configured key: string-queue
// 
// This creates a queue: silljamipoetqueue - a queue
// this uses a pre-configured blob container: outblobq
//
// outblobq is referenced in the code through: outputblob
// myQueueItem is a JSON object: { userid, search string }
async function main(searchstring) {

    console.log("searchstring -->", searchstring)
    await doMyCode(searchstring)

}

// my simple method
async function doMyCode(myQueueItem) {
    var urlLinks = []
    var URL = ""

    // 
    // check if I really have something or I was called out of the blue
    if (myQueueItem) {
        var str = myQueueItem.split(' ').join('%20')
        URL = `http://www.google.com/search?start=0&num=20&q=%22${str}%22`
        console.log("JAM---> URL-->", URL)
    } else {
        // if I was called out of the blue just return
        console.log("got junk: -- >", myQueueItem)
        return
    }
    //
    // do the communication with google
    // await 
    await rp(URL)
        .then(html => {
            console.log("called google -- here is output-->", html.substring(0, 50))
            //
            // take the google data and break it down
            //
            // adding each href to a list
            var $ = cheerio.load(html)
            var r = $('a').each(function() {
                var a = ($(this).attr('href')).split('&')[0]
                var b = a.split("q=")
                if ( (b[1]) && (b[1].startsWith('http') )) {
                    console.log(' -->', b[1])
                }
                
            })
            
                
            
            
            // var fsearch = pHTML.find('.search')
            
           

            // // now take those hrefs and blob 'em and queue 'em
            // console.log("urllinks -->", urlLinks.length)
        })
        .catch(error => {
            console.log("error-->", error)
        })
    }

    /*

    console.log("--->in the parser", value)
                var link = $(value).children().attr('href')
                if (typeof (link) === 'string') {
                    var it = link.split('/url?q=')[1]
                    console.log("it 1 -->", it)
                    it = it.split('&')[0]
                    console.log("it 2-->", it)
                    urlLinks.push(it)
                }

                 $('.med', html).each((index, value) => {
                

                // context.bindings.outputblob = html
            })
                */