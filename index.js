//required modules
const Twitter = require('twitter'); // twitter API
const watson = require('watson-developer-cloud'); //Alchemy API
const readline = require('readline');
const fs = require('fs');
const wordFrequency = require('./wordFreq.js');
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
    console.log('*** Downloading tweets... ***');
    client.get('statuses/user_timeline', { q: `${answer}`, count: 5 }, function(error, tweets, response) {
        if (!error) {
            const obj = { tweets: tweets };
            // obj.tweets.push(tweets);
            const json = JSON.stringify(obj);

            fs.writeFileSync('tweets.json', json, { space: 4 });
            console.log('*** Download Complete ***');
            // console.log(tweets);

        } else {
            console.log('Oh no! error');
        }
    });

    fs.readFile('tweets.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            const tweetLength = obj.tweets.length
            for (i = 0; i <= tweetLength - 1; i++) {
                const tweet = obj.tweets[i];
                console.log(wordFrequency(tweet.text));
                const parameters = {
                    text: tweet.text
                };
                alchemy_language.sentiment(parameters, function(err, response) {
                    if (err)
                        console.log('error:', err);
                    else
                        console.log(JSON.stringify(response, null, 2));
                });
            }
        }
    });
    rl.close();
});