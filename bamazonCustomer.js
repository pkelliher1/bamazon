// Require mysql, inquirer and console.table
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

// Establishes connection and loads product data.
connection.connect(function(err) {
 if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});

// Loads products table from a function, queries the products table via a select all SQL statement, then displays the table data in a table format via the console.table.
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    itemSelectionPrompt(res);
  });
}

// Prompts the customer to enter in the item item_id number utilizing inquirer. If valid item_id value is entered, it will display the next quantity prompt, otherwise it will display an "Item Unavailable!" message.
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
 
  // Prompts the user to enter in a quantity of the item selected, if the number entered exceeds the quantity available, an "Insufficient quantity!" message is displayed.
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

  // This function updates the products table to refelect the new quantity purchased and prints a message reflecting the quantity purchased and what was purchased.
  function itemsBought(item, quantity) {
    console.log(item, quantity)
    var newQuantity = item.stock_quantity - quantity;

    connection.query(
      "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
      [newQuantity, item.item_id],
      function(err, res) {
        if(err){
          throw err;
        }

        console.log("\nYou have bought " + quantity + " of the following " + item.product_name);
        displayProducts();
      }
    );
  }

  // This is the for loop to check to see if the product, item_id is available.
  function quantityAvail(selectionId, itemSelection) {
    for(var i = 0; i < itemSelection.length; i++) {
      if (itemSelection[i].item_id === selectionId) {
        return itemSelection[i];
        
      }
    }
  return null;
  }
