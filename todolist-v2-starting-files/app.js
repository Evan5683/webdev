//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

// item schema
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Item111111"
});

const item2 = new Item({
  name: "Item22222"
});

const item3 = new Item({
  name: "Item33333"
});

const defaultItems = [item1, item2, item3];



app.get("/", function (req, res) {
  Item.find()
    .then(foundItems => {
      if (foundItems.length === 0) {
        // Insert defaultItems only if no items found
        Item.insertMany(defaultItems)
          .then(insertedItems => {
            console.log("Success insert:", insertedItems);
            res.redirect("/");
          })
          .catch(error => {
            console.log("Error inserting items:", error);
            res.status(500).send("Error inserting items");
          });
      } else {
        console.log("Found items:", foundItems);
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch(error => {
      console.log("Error finding items:", error);
      res.status(500).send("Error finding items");
    });
});


app.post("/", function (req, res) {

  const item = req.body.newItem;


});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
