var keys = require("./keys.js");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");



if (process.argv[2] === "my-tweets") {
    twitter();
}
else if (process.argv[2] === "spotify-this-song") {
    spotify();
}
else if (process.argv[2] === "movie-this") {
    movie();
}
else if (process.argv[2] === "do-what-it-says") {
    doWhatItSays();
}


//function to display twitter information
function twitter() {

    //twitter npm credentials
    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: 'bermessa',
        count: 20
    };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        if (!error) {
            for (var i = 0; i < params.count; i++) {
                console.log("===========================");
                console.log("Time stamp: " + tweets[i].created_at);
                console.log("Tweet: " + tweets[i].text);
                console.log("===========================");
            }
        }
    });
}

//function to display spotify information
function spotify() {

    //spotify npm crendentials
    var spotify = new Spotify(keys.spotifyKeys);

    //set up inquirer to input into spotify credentials
    inquirer.prompt([
            {
                type: "input",
                message: "Enter a song you would like to search for:",
                name: "song"
        }
    ])
        .then(function(songChoice) {

            if (!songChoice.song) {

                spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }

                    console.log("===========================");
                    console.log("Song name: " + data.tracks.items[7].name);
                    console.log("Artist name: " + data.tracks.items[7].artists[0].name);
                    console.log("===========================");

                });

            }
            else {
                spotify.search({ type: 'track', query: songChoice.song }, function(err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }

                    console.log("===========================");
                    console.log("Song name: " + data.tracks.items[0].name);
                    console.log("Artist name: " + data.tracks.items[0].album.artists[0].name);
                    console.log("Album name: " + data.tracks.items[0].album.name);
                    console.log("Link to Spotify: " + data.tracks.items[0].album.artists[0].external_urls.spotify);
                    console.log("===========================");

                });
            }
        });
}

function movie() {

    inquirer.prompt([
            {
                type: "input",
                message: "Enter a movie you would like to search for:",
                name: "movie"
        }
        ])
        .then(function(movieChoice) {

            if (!movieChoice.movie) {
                request("http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {

                    if (error) {
                        return console.log(error);
                    }

                    console.log("===========================");
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Movie Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Produced in: " + JSON.parse(body).Country);
                    console.log("Languages: " + JSON.parse(body).Language);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("===========================");

                });
            }
            else {
                var queryUrl = "http://www.omdbapi.com/?t=" + movieChoice.movie + "&y=&plot=short&apikey=trilogy";
                request(queryUrl, function(error, response, body) {

                    if (error) {
                        return console.log(error);
                    }

                    console.log(JSON.parse(body));


                    console.log("===========================");
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Movie Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Produced in: " + JSON.parse(body).Country);
                    console.log("Languages: " + JSON.parse(body).Language);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("===========================");

                });
            }
        });
}


function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var command = dataArr[0];
        var userInput = dataArr[1];

        if (command === "spotify-this-song") {
            spotifySearch(userInput);
        }

    });

}

function spotifySearch(song) {
    var spotify = new Spotify(keys.spotifyKeys);

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("===========================");
        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Artist name: " + data.tracks.items[0].album.artists[0].name);
        console.log("Album name: " + data.tracks.items[0].album.name);
        console.log("Link to Spotify: " + data.tracks.items[0].album.artists[0].external_urls.spotify);
        console.log("===========================");

    });
}
