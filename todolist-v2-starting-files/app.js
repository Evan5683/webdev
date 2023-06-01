//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb://localhost:27017/todolistDB",
  { useNewUrlParser: true }
);

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your todolist111" });

const item2 = new Item({ name: "Welcome to your todolist222" });

const item3 = new Item({ name: "Welcome to your todolist333" });

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item
    .find({})
    .exec()
    .then(foundItems => {
      const listTitle = "Today";
      if (foundItems.length === 0) {
        Item
          .insertMany(defaultItems)
          .then(() => {
            console.log("Success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      res.render("list", {
        listTitle: listTitle,
        newListItems: foundItems
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({ name: itemName });

  item.save();

});

app.post("/delete", function (req, res) {
  console.log(req.body);
  const checkedItemId = req.body.checkbox;
  Item
    .findByIdAndDelete(checkedItemId)
    .then(() => {
      console.log("Success delete");
    })
    .catch((err) => {
      console.log(err);
    });
})

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
