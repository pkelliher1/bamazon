# bamazon
CLI bamazon customer view assignment (Node.js & MySQL)

## Overview

This is an Amazon-like storefront utilizing Node.js & MySQL. The app takes in orders from customers and depletes stock from the store's inventory.

## Step 1.

I created a MySQL database titled bamazon_db, containing a products table with the following columns, item_id, product_name, department_name, price and stock_quantity, for this assigment I decided to create a home improvement store, please see the following:

```
-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;
-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;
-- Creates the table "people" within animals_db --

CREATE TABLE products (
-- Creates a numeric column called "item_id" (unique id for each product) which will automatically increment its default value as we create new rows --
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
-- Makes a string column called "product_name" which cannot contain null --
product_name VARCHAR(30) NOT NULL,
-- Makes a string column called "department_name" which cannot contain null --
department_name VARCHAR(30) NOT NULL,
-- Makes a numeric column called "price" (cost to customer) which cannot contain null --
price INTEGER(3) NOT NULL,
-- Makes a numeric column called "stock_quantity" (how much of the product is available in stores)
stock_quantity INTEGER(3) NOT NULL,
-- Sets item_id as this table's primary key which means all data contained within it will be unique --
PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawnmower", "Garden", 300, 10);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hammer", "Tools", 25, 100);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Spray paint", "Paint", 10, 200);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Light bulbs", "Home Improvement", 2, 500);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Screwdriver", "Tools", 10, 100);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Socket set", "Tools", 20, 15);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Paint brush", "Paint", 10, 30);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Light Switches", "Home Improvement", 4, 20);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Screws", "Home Improvement", 300, 10);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Grass seeds", "Garden", 1, 700);
```

Here is a screenshot of the CLI displaying this table:

Insert link to products table image here.


## Step 2.

Created a JavaScript file titled bamazonCustomer.js which requires the MySQL, Inquirer and console.table npm packages:

1. The bamazonCustomer.js displays the table containing all the columns and associated data, it then prompts the user to select an item number associated with the item_id:
 
Enter Image here:

2. Displays the item selected, then prompts for quantity desired:

Enter image here:

3. Updates the database, reducing the quantity specified for the item slected:

Enter image here:

Here is the bamazonCustomer.js code with corresponding comments:

```
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
  ```