//required modules
const Twitter = require('twitter'); // twitter API
const watson = require('watson-developer-cloud'); //Alchemy API
const readline = require('readline');
const fs = require('fs');
require('dotenv').config();

const green = '\u001b[42m \u001b[0m';
const red = '\u001b[41m \u001b[0m';

const ProgressBar = require('progress');

const alchemy_language = watson.alchemy_language({
    api_key: process.env.ALCHEMY_API_KEY
});

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('******** Enter twitter username below ********')

rl.question('Username: ', (answer) => {
    client.get('statuses/user_timeline', { q: `${answer}`, count: 20 }, function(error, tweets, response) {
        if (!error) {
            const obj = { tweets: [] };
            obj.tweets.push(tweets);
            const json = JSON.stringify(obj);
            // const bar = new ProgressBar('Downloading... [:bar] :percent :etas', {
            //     complete: green,
            //     incomplete: red,
            //     total: 20
            // });
            fs.writeFileSync('tweets.json', json, { space: 4 });
            console.log(tweets);
        } else if (error) {
            console.log('Oh no! error');
        }
    });

    // word count frequency
    function wordFrequency(s) {
        s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude  start and end white-space
        s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
        s = s.replace(/\n\r/, "\n"); //newline
        s = s.replace(/[^a-zA-Z 0-9]+/g, ''); //special characters
        const words = s.split(/\s/);
        const wordMap = {};

    }

    rl.close();
});



// var parameters = {
//     text: 'I like pizza hut a lot'
// };

// alchemy_language.sentiment(parameters, function(err, response) {
//     if (err)
//         console.log('error:', err);
//     else
//         console.log(JSON.stringify(response, null, 2));
// });