/**
	getTweets() Usage:
		return value - None
		
		lat - float representing lattitude
		lon - float representing longitude
		lon - float representing radius about lat/lon to get tweets from
		count - integer representing maximum number of tweets desired. Actual number returned could be less.
		my_callback - function object representing what to do with tweets once they are returned. Should take one parameter: a list of json objects. 
			Each Json object has the following fields:
			"user": string representing real name of user
			"screen_name": string representing screen name of user
			"text": string representing the text of the tweet
			"images": array of strings representing URLs of any images in the tweet. Array could be empty if tweet did not have an image.
*/

//Note: Server currently set to contact 127.0.0.1, we will want to change that when we know what our server is. The backend authentication also uses 127.0.0.1 as its "callback server" (whatever that is), we'll probably have to adjust that too.
function getTweets(lat,lon,rad,count,my_callback) {
	var geocode = lat.toString() + "," + lon.toString() + "," + rad.toString() + "mi";
	
	var query_url = "http://127.0.0.1/gettweet";
	query_url += "?geocode=" + geocode;
	query_url += "&count=" + count.toString();
	
	$.get({
        url: query_url,
        type: "GET",
		dataType: "json",
        success: function(result) {
			console.log(result);
			my_callback(result);
        },
        error: function (err) {
            console.log(err);
        },
    });
}