//dependencies
var express = require("express");
//var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var logger = require("morgan");

// require all models
var db = require("./models");

var PORT = 3000;

// initialize Express
var app = express();

// use morgan logger for logging requests
app.use(logger("dev"));
// use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// connecting to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines");

//routes
//get route to scrape the frontendfront website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://frontendfront.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // grabbing every h2 within an section tag
      $("section h2").each(function(i, element) {
        // save as an empty result object
        var result = {};
  
        // adding the text and href of every link and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // creating a new Article using the result object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            // if an error occurred send it to the client
            return res.json(err);
          });
      });
  
      // if we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
});

// route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // if we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // if an error occurred, send it to the client
        res.json(err);
      });
});

// starting the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});