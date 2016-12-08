require('dotenv').config();

//required modules
const Twitter = require('twitter'); // twitter API
//const watson = require('watson-developer-cloud'); //Alchemy API
const readline = require('readline');
const Promise = require('promise');
const fs = require('fs');
const alchemy = require('node_alchemy')(process.env.ALCHEMY_API_KEY);
const wordFrequency = require('./wordFreq.js');
var colors = require('colors/safe');
//const ProgressBar = require('progress');

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
    client.get('statuses/user_timeline', { screen_name: username }, function(error, tweets, response) {
        if (!error) {
            console.log('---------------------------------------------');
            console.log('Hello: ', username);
            console.log('---------------------------------------------');
            console.log('What would you like to do?\n1. View Your Tweets Sentiment Analysis\n2. View Your Tweets Word Frequency\n');
            rl.question('Type 1 or 2: ', (answer) => {

                if (answer == 1) { // Twitter Sentiment Analysis
                    console.log('---------------------------------------------');
                    console.log(colors.bold.green('Sentiment Analysis'));
                    console.log('---------------------------------------------');
                    console.log('How many tweets would you like to analyse');
                    console.log('---------------------------------------------');
                    rl.question('Number of tweets: ', (tweetnum) => {

                        console.log('*** Analysing ' + tweetnum + ' tweets... ***');
                        client.get('statuses/user_timeline', { screen_name: username, count: tweetnum }, function(error, tweets, response) {
                            var aggregate = [];
                            var count = 0;
                            if (!error) {
                                const obj = { tweets: tweets };
                                const tweetLength = obj.tweets.length;
                                for (i = 0; i <= tweetLength - 1; i++) {
                                    const tweet = obj.tweets[i];
                                    var p = alchemy.lookup('sentiment', 'text', tweet.text)
                                        .then(function(result) {
                                            console.log(tweet.text);
                                            count += parseFloat(result.data.docSentiment.score) || 0;
                                        })
                                        .catch(function(err) {
                                            //console.log({ status: 'error', message: err });
                                        });
                                    aggregate.push(p);
                                }
                                //**** http://jsfiddle.net/dukeytoo/02ohnth4/
                                Promise.all(aggregate).then(function(result) {
                                    return Promise.resolve(count);
                                }).then(conditions).then(function() {
                                    console.log('---------------------------------------------')
                                    console.log('*** Sentiment Analysis Complete ***');
                                }).catch(function(err) {
                                    //console.log({ status: 'error', message: err });
                                });
                            } else {
                                console.log('Oh no! error');
                            }
                        });

                        rl.close();
                    })

                } else if (answer == 2) { // Word Frequency count
                    console.log('---------------------------------------------');
                    console.log(colors.bold.green('Word Frequency(Excluding Stop Words)'));
                    console.log('---------------------------------------------');
                    console.log('*** Analysing please wait... ***');
                    console.log('---------------------------------------------');
                    client.get('statuses/user_timeline', { screen_name: username, count: 10 }, function(error, tweets, response) {
                        if (!error) {
                            const obj = { tweets: tweets };
                            const tweetLength = obj.tweets.length;

                            for (i = 0; i <= tweetLength - 1; i++) {

                                const tweet = obj.tweets[i];
                                const words = wordFrequency(tweet.text);
                                var iWordsCount = words.length;

                                console.log(colors.green('Words  =>  Frequencies'));
                                for (var i = 0; i < iWordsCount; i++) {
                                    var word = words[i];
                                    console.log(word.text + '  =>  ', word.frequency);
                                }
                            }

                            const json = JSON.stringify(obj);
                            fs.writeFileSync('tweets.json', json, { space: 4 });
                            console.log('---------------------------------------------');
                            console.log('*** Analysis Complete ***');
                            console.log('---------------------------------------------');

                        } else {
                            console.log('Oh no! error');
                        }

                    });
                    rl.close();
                } else {
                    console.log('Your anwser should be 1 or 2');
                }
            })
        } else {
            console.log('Oh no! error, Please confirm your username and try again');
            r1.close();
        }
    });
    //r1.close();
});

function conditions(count) {
    // console.log(count)
    if (count > 0) { // positive
        return positive();
    } else if (count == 0) { //neutral
        return neutral();
    } else if (count < 0) { // negative
        return negative();
    }
}

function positive() {
    console.log('---------------------------------------------');
    console.log(colors.green('Sentiment Analysis: Tweets are Postive'));
    return Promise.resolve('---------------------------------------------');
}

function neutral() {
    console.log('---------------------------------------------');
    console.log(colors.yellow('Sentiment Analysis: Tweets are Neutral'));
    return Promise.resolve('---------------------------------------------');
}

function negative() {
    console.log('---------------------------------------------');
    console.log(colors.red('Sentiment Analysis: Tweets are Negative'));
    return Promise.resolve('---------------------------------------------');
}