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

//
const Item = mongoose.model("Item", itemsSchema);

//default 3 items
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/")
  } else {
    List.findOne({ name: listName })
      .then(foundList => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }).catch(error => {
        console.log("Error deleting item:", error);
      });
  }


});


app.post("/delete", function (req, res) {
  const deleteItemId = req.body.checkbox; // 修改变量名为 deleteItemId
  console.log(deleteItemId)
  Item.findByIdAndRemove(deleteItemId)
    .then(deletedItemId => {
      if (deletedItemId) {
        console.log("Success delete:", deletedItemId);
        res.redirect("/");
      } else {
        console.log("Item not found:", deleteItemId);
      }

    })
    .catch(error => {
      console.log("Error deleting item:", error);
      res.status(500).send("Error deleting item");
    });
});


//自定义列表
app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName })
    .then(foundList => {
      if (foundList) {
        console.log("exist");
        //显示list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      } else {
        console.log("no exist");

        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save()
          .then(savedList => {
            console.log("List saved:", savedList);
            // 处理保存成功的逻辑
          })
          .catch(error => {
            console.log("Error saving list:", error);
            // 处理保存失败的逻辑
          });
        //重定向至新的页面
        res.redirect("/" + customListName);
      }
    })
    .catch(error => {
      console.log("Error finding list:", error);
      res.status(500).send("Error finding list");
    });
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
