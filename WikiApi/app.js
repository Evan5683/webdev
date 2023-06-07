//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
//TODO

app.route("/articles")
    .get(function (req, res) {
        Article.find().then(foundArticles => {
            res.send(foundArticles);
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    })
    .post(function (req, res) {
        const title = req.body.title;
        const content = req.body.content;

        const newArticle = new Article({
            title: title,
            content: content
        });

        newArticle.save();
    })
    .delete(function (req, res) {
        Article.deleteMany().then(deleteArticles => {
            res.send("delete:", deleteArticles);
        }).catch(err => {
            console.log(err);
            res.send(err);
        })
    });


///request a specific article

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle })
            .then(foundArticle => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("Nothing found.");
                }
            })
            .catch(err => {
                console.log(err);
                res.send(err);
            });
    })
    .put(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true }
        )
            .then(updateArticle => {
                res.send("Update: " + updateArticle);
            })
            .catch(err => {
                console.log(err);
                res.send(err);
            });
    }).patch(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            { overwrite: true }
        )
            .then(updateArticle => {
                res.send("Patch: " + updateArticle);
            })
            .catch(err => {
                console.log(err);
                res.send(err);
            });
    }).delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle })
            .then(deleteArticle => {
                res.status(200).send("Delete: " + deleteArticle);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });



app.listen(3000, function () {
    console.log("Server started on port 3000");
});