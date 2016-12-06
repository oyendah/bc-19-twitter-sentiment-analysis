const stopWords = ["a", "a\'s", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "arent", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];
// stopWords.forEach(function(word) {
//     if (word.length > 5) {
//         stopWords.splice(stopWords.indexOf(word));
//     }
// })

module.exports = stopWords;
const fs = require('fs');
// fs.readFile('tweets.json', 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         for (i = 0; i <= obj.tweets.length - 1; i++) {
//             // console.log(wordFrequency(obj.tweets[i].text));
//             console.log(obj.tweets[i].text);
//         }
//     };
// });

// word count frequency
var words = (function() {
    var wordString = "words reserved like words like prototype and there ok? words toString";
    // var sWords = document.body.innerText.toLowerCase().trim().replace(/[,;.]/g,'').split(/[\s\/]+/g).sort();
    var sWords = wordString.replace(/[^a-zA-Z 0-9]+/g, '').split(/[\s\/]+/g).sort()
    var iWordsCount = sWords.length; // count w/ duplicates

    // array of words to ignore
    var ignore = ['and', 'the', 'to', 'a', 'of', 'for', 'as', 'i', 'with', 'it', 'is', 'on', 'that', 'this', 'can', 'in', 'be', 'has', 'if'];
    ignore = (function() {
        var o = {}; // object prop checking > in array checking
        var iCount = ignore.length;
        ignore.forEach(function(i) {
            o[ignore[i]] = true;
        });
        // for (var i = 0; i < iCount; i++) {
        //     o[ignore[i]] = true;
        // }
        return o;
    }());

    var counts = {}; // object for math
    // sWords.forEach(function(w) {
    //     var word = sWords[w];
    //     if (!ignore[word]) {
    //         counts[word] = counts[word] || 0;
    //         counts[word]++;
    //     }
    // });
    for (var i = 0; i < iWordsCount; i++) {
        var sWord = sWords[i];
        if (!ignore[sWord]) {
            counts[sWord] = counts[sWord] || 0;
            counts[sWord]++;
        }
    }

    var arr = []; // an array of objects to return
    counts.forEach(w => console.log(w));
    for (sWord in counts) {
        arr.push({
            text: sWord,
            frequency: counts[sWord]
        });
    }

    // sort array by descending frequency | http://stackoverflow.com/a/8837505
    return arr.sort(function(a, b) {
        return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
    });

}());

function wordFrequency() {
    var iWordsCount = words.length; // count w/o duplicates
    for (var i = 0; i < iWordsCount; i++) {
        var word = words[i];
        console.log(word.text + ' - ', word.frequency);
    }
};


console.log(wordFrequency());
console.log(stopWords.length);