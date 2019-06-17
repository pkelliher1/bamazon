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
  --Makes a numeric column called "stock_quantity" (how much of the product is available in stores)
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

-- Query which selects and displays all (*) columns, I.e., (product_name, department_name, price and stock_quantity) from the products table --
SELECT * FROM products;