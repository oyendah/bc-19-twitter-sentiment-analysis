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

    //text is undefined, cant access text
    fs.readFile('./tweets.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            for (i = 1; i <= obj.tweets.length; i++) {
                // console.log(wordFrequency(obj.tweets[i].text));
                console.log(obj.tweets[i].text);
            }
        };
    });

    rl.close();
});

// word count frequency
function wordFrequency(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
    s = s.replace(/\n\r/, "\n"); //newline
    s = s.replace(/[^a-zA-Z 0-9]+/g, ''); //special characters
    const words = s.split(/\s/);
    const wordMap = {};
    const stop_words = ['that', 'what', 'who', 'than', 'that', 'then'];
    for (i = 0; i < words.length; i++) {
        for (j = 0; j < stop_words; j++) {
            if (Object.hasOwnProperty.call(wordMap, w) && i !== j) {
                wordMap[w] += 1;
            } else if (!Object.prototype.hasOwnProperty.call(wordMap, w)) {
                wordMap[w] = 1;
            }
        }
    }
    // words.forEach(function(w) {
    //     //check if a word has its own property
    //     if (Object.hasOwnProperty.call(wordMap, w)) {
    //         wordMap[w] += 1;
    //     } else {
    //         wordMap[w] = 1;
    //     }
    // });
    return words
};


// var parameters = {
//     text: 'I like pizza hut a lot'
// };

// alchemy_language.sentiment(parameters, function(err, response) {
//     if (err)
//         console.log('error:', err);
//     else
//         console.log(JSON.stringify(response, null, 2));
// });