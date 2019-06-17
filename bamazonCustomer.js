var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Pk5413551!",

  // database name
  database: "bamazon_db"
});

connection.connect(function(err) {
 if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    itemSelectionPrompt(res);
  });
}

function itemSelectionPrompt(itemSelection) {
  inquirer
    .prompt([
      {
        name: "selection",
        type: "input",
        message: "Please enter in the item_id number which corresponds to the item you wish to purchase:",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(value) {
      selectionId = parseInt(value.selection);
      var item = quantityAvail(selectionId, itemSelection);
      console.log('items', item)
      if (item) {
        quantitySelectionPrompt(item);
      }
      else {
        console.log("\nItem Unavailable");
        displayProducts();
      }
    });
  }

  function quantitySelectionPrompt(item) {
    inquirer
      .prompt([
        {
          name: "quantity",
          type: "input",
          message: "How may would you like to purchase?",
          validate: function(value) {
            return value > 0;
          }
        }
      ])
      .then(function(value) {
        var quantity = parseInt(value.quantity);
        if (quantity > item.stock_quantity) {
          console.log("\nInsufficient quantity!");
          displayProducts();
        }
        else {
          itemsBought(item, quantity);
        }
      });
  }

  function itemsBought(item, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?"
      [quantity, item.item_id],
      function(err, res) {
        console.log("\nYou have bought " + quantity + "of the following " + item.product_name);
        displayProducts();
      }
    )
  }

  function quantityAvail(selectionId, itemSelection) {
    for(var i = 0; i < itemSelection.length; i++) {
      //var currentItem = itemSelection[i];
      if (itemSelection[i].item_id === selectionId) {
        return itemSelection[i];
        
      }
    }
  return null;
  }
