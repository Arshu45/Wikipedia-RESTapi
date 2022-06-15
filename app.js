// //jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikipediaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);

// ///////////////////Request Targeting All  Articles/////////////////

app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function (req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article");
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully Deleted All the Articles!");
      }
    });
  });

//////////Request Targeting Specific Articles///////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      {
        title: req.params.articleTitle,
      },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No title matching that articles found!");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      {
        title: req.params.articleTitle,
      },
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        overwrite: true,
      },

      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully Updated the Article");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully Updated the Article check");
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully Deleted the Article Check");
      }
    });
  });

app.listen(1000, function () {
  console.log("Server started at Port 3000");
});
