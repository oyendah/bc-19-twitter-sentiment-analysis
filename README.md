# bc-19-twitter-sentiment-analysis
Twitter sentiment analysis command line application using JavaScript nodejs

## Functionalities
* Retrieve users tweets
* Analyse tweets sentiment using Alchemy API
* Performs word count frequency on tweets while excluding stop-words.
* Saves retrieved tweets to json file

## Dependencies
* This application functionality depends on multiple JavaScript packages
  * [Twitter](https://www.npmjs.com/package/twitter) - Twitter API client library for node.js, this package enables the app to retrieve user's tweets.

  * [Node Alchemy](https://www.npmjs.com/package/node_alchemy) - A promise based JavaScript interface for the Alchemy API, this package enables the app to sentiment analysis on each tweets retrieved.

  * [Promise](https://www.promisejs.org/) - It allows you to associate handlers to an asynchronous action's eventual success value or failure reason

  * [.ENV](https://www.npmjs.com/package/dotenv) - This package loads environment variables from .env file.

  * [Colors](https://www.npmjs.com/package/colors) - Adds color to my nodejs console.

## API Requirements
* You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys. You can get these [here](https://apps.twitter.com/). 

* You also need Alchemy API key, You can get it [here](http://www.alchemyapi.com/api/register.html).

## Installation and Setup
* Navigate to a directory of choice on `terminal`.

* Clone this repository to your direcory
> `https://github.com/oyendah/bc-19-twitter-sentiment-analysis.git`

* Navigate to the repo's folder on your computer
  * `cd bc-19-twitter-sentiment-analysis.git`

* Install the depenencies
  * `npm install`

* Create .env file in the root and set your API credentials. 
  ```
  TWITTER_CONSUMER_KEY = xxx
  TWITTER_CONSUMER_SECRET = xxx
  TWITTER_ACCESS_TOKEN_KEY = xxx
  TWITTER_ACCESS_TOKEN_SECRET = xxx

  ALCHEMY_API_KEY = xxx
  ```
* Run app 
  * `node index`

