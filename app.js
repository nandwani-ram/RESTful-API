// All require Statements

var express = require("express");
var ejs = require("ejs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

// Connecting to Database

mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true, useNewUrlParser: true});

// App Configuration

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Mongoose.model configuration

var articleSchema = new mongoose.Schema({           //Standard schema for our database
    title: String,
    content: String
});

var Article = mongoose.model("Article", articleSchema);         //Article collection for our wikiDB database

// Single route having get, post and delete because they have the same path
// Request targetting all artcles

app.route("/articles")

.get(function(req, res){            //Get all articles
    Article.find({}, function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            res.render("index", {foundArticles: foundArticles});
        }
    });
})

.post(function(req, res){           //Creating a new articles using post reques
    var newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully added to database");
        }
    });
})

.delete(function(req, res){             //Deleting all articles from DB
    Article.deleteMany({}, function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully deleted all articles");
        }
    });
});

// Request targetting a specific article

app.route("/articles/:articleTitle")

//Get an specific article
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(err){
            res.send("No articles matching found");
        }else{
            res.send(foundArticle);
        }
    });

})

//Updating value of article using a less used put request 
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated in the database");
            }
        }
        );
})

//Updating a value using much used patch request

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Successfully updated database");
            }
        }
    );
})

//Deleting a specific request

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send("Successfully deleted the request");
            }
        }
    );
});


app.listen(3000, function(req, res){
    console.log("Server started on port 3000");
});