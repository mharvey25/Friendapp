
// LOAD DATA
// We are linking our routes to a series of "data" sources.

var friendsData = require("../data/friends");

// ROUTING

module.exports = function (app) {

    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)

    app.get("/api/friends", function (req, res) {
        res.json(friendsData);
    });

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array

    app.post("/api/friends", function (req, res) {

        var friendName = "";
        var friendPhoto = "";
        var difference = 40;

        // For-each loop to go through the data in friends.js to find a match
        friendsData.forEach(function (friend) {
            // Variables for comparing matches
            var matchedScoresArray = [];
            var totalDifference = 40;

            // Function to assist in the addition reduce() below
            function add(total, num) {
                return total + num;
            }

            // This loops through each item of the scores arrays
            // from both the stored data and the new user, 
            // and then substracts, absolutes, and then pushes the 
            // new value to the matchedScoresArray
            for (var i = 0; i < friend.scores.length; i++) {
                matchedScoresArray.push(Math.abs(parseInt(req.body.scores[i]) - parseInt(friend.scores[i])));
            }

            // This reduces the matchScoresArray into a single value in a variable
            totalDifference = matchedScoresArray.reduce(add, 0);
            console.log("difference " + totalDifference);
            // If the above value is smaller than the previous difference...
            if (totalDifference < difference) {
                // Set it as the previous difference...
                difference = totalDifference;
                // And set these variables to the appropriate friend match
                friendName = friend.name;
                console.log(friendName);
                friendPhoto = friend.photo;
                console.log(friendPhoto);
            }
        });

        // Once the cycle is complete, the match with the least difference will remain,
        // and that data will be sent as a json object back to the client
        res.json({
            name: friendName,
            photo: friendPhoto
        });
        
        // console.log("res " + res.json);
        // This adds the new users sent data object to friends.js
        friendsData.push(req.body);
    });
}