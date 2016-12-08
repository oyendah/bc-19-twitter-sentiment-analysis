require('dotenv').config();

//required modules
const Twitter = require('twitter'); // twitter API
const watson = require('watson-developer-cloud'); //Alchemy API
const readline = require('readline');
const Promise = require('promise');
const bluebird = require('bluebird');
const fs = require('fs');
const Q = require('q');
var alchemy = require('node_alchemy')(process.env.ALCHEMY_API_KEY);
const wordFrequency = require('./wordFreq.js');
var colors = require('colors/safe');
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

rl.question('Username: ', (username) => {
    console.log(colors.bold('*** Confirming username please wait... ***'));
    client.get('statuses/user_timeline', { q: `${username}` }, function(error, tweets, response) {
        if (!error) {
            console.log('---------------------------------------------');
            console.log('Hello: ', username);
            console.log('---------------------------------------------');
            console.log('What would you like to do?\n1. View Your Tweets Sentiment Analysis\n2. View Your Tweets Word Frequency\n');
            rl.question('Type 1 or 2: ', (answer) => {
                // console.log('You chose: '+answer);
                if (answer == 1) { // Twitter Sentiment Analysis
                    console.log('---------------------------------------------');
                    console.log(colors.bold.green('Sentiment Analysis'));
                    console.log('---------------------------------------------');
                    console.log('How many tweets would you like to analyse');
                    console.log('---------------------------------------------');
                    rl.question('Number of tweets: ', (tweetnum) => {
                        // console.log(tweetnum);
                        console.log('*** Analysing ' + tweetnum + ' tweets... ***');
                        client.get('statuses/user_timeline', { q: `${username}`, count: `${tweetnum}` }, function(error, tweets, response) {
                            var aggregate = [];
                            var count = 0;
                            if (!error) {
                                const obj = { tweets: tweets };
                                const tweetLength = obj.tweets.length;
                                for (i = 0; i <= tweetLength - 1; i++) {
                                    const tweet = obj.tweets[i];

                                    alchemy.lookup('sentiment', 'text', tweet.text)
                                        .then(function(result) {
                                            console.log(tweet.text);
                                            aggregate += parseFloat(result.data.docSentiment.score);

                                            //total = aggregate;
                                        })
                                        .catch(function(err) {
                                            //console.log({ status: 'error', message: err });
                                        });


                                }

                                // if (count === tweetLength) {
                                //     console.log('Sentiment Analysis: ' + aggregate);
                                //     console.log('*** Sentiment Analysis Complete ***');
                                // }


                                // if (aggregate >= 1 && aggregate > 0.1) { // positive

                                // } else if (aggregate <= 0.1 && aggregate > -1) { //neutral

                                // }

                            } else {
                                console.log('Oh no! error');
                            }
                        });

                        rl.close();
                    })

                } else if (answer == 2) { // Word Frequency count
                    console.log('---------------------------------------------');
                    console.log(colors.bold.green('Word Frequency'));
                    console.log('---------------------------------------------');
                    console.log('*** Analysing please wait... ***');
                    client.get('statuses/user_timeline', { q: `${username}`, count: 5 }, function(error, tweets, response) {
                        if (!error) {
                            const obj = { tweets: tweets };
                            const tweetLength = obj.tweets.length
                            const json = JSON.stringify(obj);
                            for (i = 0; i <= tweetLength - 1; i++) {
                                const tweet = obj.tweets[i];
                                // console.log(wordFrequency(tweet.text));
                                const words = wordFrequency(tweet.text);
                                var iWordsCount = words.length; // count w/o duplicates
                                for (var i = 0; i < iWordsCount; i++) {
                                    var word = words[i];
                                    console.log('Words  =>  Frequencies'.green);
                                    console.log(word.text + '  =>  ', word.frequency);
                                }

                            }

                            fs.writeFileSync('tweets.json', json, { space: 4 });

                            console.log('*** Analysis Complete ***');
                            // console.log(tweets);

                        } else {
                            console.log('Oh no! error');
                        }

                    });
                    rl.close();
                } else {
                    console.log('Your anwser should be a 1 or 2');
                }
            })
        } else {
            console.log('Oh no! error');
        }
    });
    //r1.close();
});

function getAggregate(tweets) {
    return new Promise(function(resolve, reject) {
        var aggregate = 0;
        var count = 0;
        const tweetLength = tweets.length;
        for (i = 0; i <= tweetLength - 1; i++) {
            const tweet = obj.tweets[i];
            alchemy.lookup('sentiment', 'text', tweet.text)
                .then(function(result) {
                    console.log(tweet.text);
                    resolve(aggregate += parseFloat(result.data.docSentiment.score) || 0);

                })
                .catch(function(err) {
                    //console.log({ status: 'error', message: err });
                });

        }
    })
}
// fs.readFile('tweets.json', 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         const tweetLength = obj.tweets.length
//         for (i = 0; i <= tweetLength - 1; i++) {
//             const tweet = obj.tweets[i];
//             console.log(wordFrequency(tweet.text));
//             const parameters = {
//                 text: tweet.text
//             };
//             alchemy_language.sentiment(parameters, function(err, response) {
//                 if (err) {
//                     console.log('error:', err);
//                 } else {
//                     console.log(JSON.stringify(response.docSentiment, null, 2));
//                 }

//             });
//         }
//     }
// });
// rl.close();