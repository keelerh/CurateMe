//This node.js module will use the express library to run an HTML server. Static pages will be served from the 'public' subdirectory.
var express = require('express');
var app = express();
app.use(express.static('three.js-master/examples'));

var server_address = "http://18.189.111.137";

var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('6db0abc71b2b08ed44bfd458cc18dad7378e13a0');


//Using a node.js Twitter API library that takes care of authentication.
var Twitter = require('twitter-node-client').Twitter;
var config = {
	"consumerKey": "h1EnoJNeMc9jSTygwK2AvcXtN",
	"consumerSecret": "skUW7jXuzU4kTXVDXmsQ6E3hB0cBZp3dRDjVuzLHrt0g6KWWdw",
	"accessToken": "717536438884114432-Ri5WYddEPUvg5AZHIhxVmkFyTgL7zo7",
	"accessTokenSecret": "rwgYdJXC57ZooXFc9yPsNL8NB3TvDkp9NQk2qv1kkNzSg",
	"callBackUrl": server_address
}
var twitter = new Twitter(config);



//This gets the server ready to respond to the /gettweet REST endpoint. Usage is: /gettweet?geocode={float-lattitude},{float-longitude},{float-radius}mi&count={integer-count}"
app.get('/gettweet', function (req, res) {
	console.log("Received gettweet request!");
	twitter.getSearch({'geocode':req.query.geocode,'count': parseInt(req.query.count)}, 
	function(err, response, body) {
		        console.log('ERROR [%s]', err);
	}, 
	function (data) {
        console.log("Data received from Twitter and being relayed to client...");
		
		//each "status" object is a tweet
		statuses = JSON.parse(data)["statuses"];
		pruned_list = [];
		
		//go through list of tweets and extract only the information needed for CurateMe
		for (var i = 0; i < statuses.length; i++) {
			new_obj = {};
			new_obj.name = statuses[i]["user"]["name"];
			new_obj.screen_name = statuses[i]["user"]["screen_name"];
			new_obj.text = statuses[i]["text"];
			new_obj.images = [];
			new_obj.emotion = "positive";
			new_obj.emotion_processed = false;
			//tweets will not have media field populated if the tweet had no image
			if (statuses[i]["entities"].hasOwnProperty("media")) {
				media_list = statuses[i]["entities"]["media"];
				for (var n =0; n < media_list.length; n++) {
					new_obj.images.push(media_list[n]["media_url"]);
				}
			}
			pruned_list.push(new_obj);
		}
		
		current_index = 0;
		
		
		
		function processTweet(err,response) {
			if (err) throw err;
			pruned_list[current_index].emotion = response.docSentiment.type;
			
			if (current_index < (pruned_list.length-1)) {
				current_index += 1;
				alchemy.sentiment(pruned_list[current_index].text,{},processTweet);
				
			} else {
				res.send(JSON.stringify(pruned_list));
			}
			
			
		}
		
		
		alchemy.sentiment(pruned_list[current_index].text, {}, processTweet);
		
		/*
		//go through every emotion now
		alchemy.sentiment("I hate you!", {}, function(err, response) {
			if (err) throw err;

			// See http://www.alchemyapi.com/api/ for format of returned object
			var sentiment = response.docSentiment;
			new_obj[0].emotion = sentiment.type;
			console.log("Sentiment: " + response["docSentiment"]["type"] + " is of type " + typeof(response["docSentiment"]["type"]));

			// Do something with data
		});*/
		
		//send JSON list to client.

    });
})

//This code starts the HTML server on port 80. If an exception is thrown, make sure the machine this is being run on does not already have a web server running on port 80.
var server = app.listen(80, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})