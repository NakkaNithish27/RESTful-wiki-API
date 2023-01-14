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
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = new mongoose.model("Article", articleSchema);
/////////////////////////////////Requests Targetting All Articles/////////////////////////////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    })
  })

  .post(function(req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all the articles");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////////Requests Targetting a Specific Article /////////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticles) {
      if (foundArticles) {
        res.send(foundArticles);
      } else {
        res.send("No articles found with that title");
      }
    });
  })
  .put(function(req, res) {

    Article.findOneAndReplace({
        title: req.params.articleTitle
      },
      req.body, null,
      function(err, docs) {
        if (err) {
          console.log(err)
        } else {
          res.send("Document replaced Successfully!");
        }
      }
    );
    // Article.updateOne({title:req.params.articleTitle},
    //   {$set: {title:req.body.title,content:req.body.content}},
    //   {overwrite: true},
    //   function(err){
    //     if(!err){
    //       res.send("Successfully updated the article");
    //     }
    //   });


  })
  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the article");
        }
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Article deleted successfully!");
      } else {
        res.send(err);
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
