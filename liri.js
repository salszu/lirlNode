var fs = require("fs");
//pulling access tokens from keys.js
var twitterKeys = require("./keys.js");
//npm install twitter/request/spotify
var twitter = require('twitter');
var request = require('request');
var spotify = require('spotify');
var params = process.argv.slice(2);

switch (params[0]) {

    case "tweets":
    case "twitter":
    case "my-tweets":
        twitterCall(params[1]);
        break;

    case "song":
    case "spotify":
    case "spotify-this-song":
        if (params[1]) {
            spotifyCall(params[1]);
        } else {
            spotifyCall("Blink 182 - What's My Age Again");
        }
        break;

    case "movie":
    case "movie-this":
        if (params[1]) {
            movieCall(params[1]);
        } else {
            if (params[1] === undefined) {
                params[1] = "Mr. Nobody";
                movieCall();
            }
        }
        break;

    case "do":
    case "do-what-it-says":
        doCall(params[1]);
        break;
}



//twitter function
function twitterCall() {
    var client = new twitter({
        consumer_key: twitterKeys.twitterKeys.consumer_key,
        consumer_secret: twitterKeys.twitterKeys.consumer_secret,
        access_token_key: twitterKeys.twitterKeys.access_token_key,
        access_token_secret: twitterKeys.twitterKeys.access_token_secret
    });
    var twitterUser = 'sal_szu';
    twitterUser = params[1];
    params = { screen_name: twitterUser };
    client.get('statuses/user_timeline', params, function(error, data, response) {
        if (error) {
            throw error;
        }
        for (var i = 0; i < data.length; i++) {
            var twitterResults =
                "@" + data[i].user.screen_name + ": " +
                data[i].text + "\r\n" +
                data[i].created_at + "\r\n" +
                "------- End Tweet -------" + "\r\n";
            console.log(twitterResults);
            logData(twitterResults);
        }
    })
};
//spotify function
function spotifyCall(songName) {
    spotify.search({ type: 'track', query: songName }, function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }
        var albumInfo = data.tracks.items[0];
        var spotifyResults =
            "Artist: " + albumInfo.artists[0].name + "\r\n" +
            "Track Name: " + albumInfo.name + "\r\n" +
            "Album: " + albumInfo.album.name + "\r\n" +
            "Preview Link: " + albumInfo.preview_url + "\r\n";
        console.log(spotifyResults);
        logData(spotifyResults);
    })
};
//OMDB function goes here
//IF I COULD GET IT TO WORK

//random.txt function
function doCall() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }
        data = data.split(',');
        spotifyCall(data[1]);
    })
};

//bonus function
function logData(logEntry) {
    fs.appendFile("./log.txt", logEntry, (error) => {
        if (error) {
            throw error;
        }
    });
}
