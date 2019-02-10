-- if having authentication issues, use code below
ALTER USER 'bamazon'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Coding123';
FLUSH privileges;

-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- create DB called bamazon
CREATE DATABASE bamazon_db;
-- make bamazon deafult target of queries
USE bamazon_db;
-- create products table
CREATE TABLE products(
-- unique id for each product
item_id INTEGER NOT NULL AUTO_INCREMENT,
-- product_name - Name of product
product_name VARCHAR(50) NOT NULL,
-- department name
department_name VARCHAR(50),
-- price - cost to customer
price INTEGER,
-- stock_quantity - how much of the product is available in store
stock_quantity INTEGER,
-- make item_id the primary key
PRIMARY KEY(item_id)
);

-- add products
INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("75 Inch Samsung TV", "Electronics", 1995, 20), ("45 Inch Sharp TV", "Electronics", 1295, 25), ("Helmet", "Sports", 30, 100),("Bike", "Sports", 250, 20), ("Soccer Ball", "Sports", 10, 150), ("Skates", "Sports", 300, 12), ("Ice Cream", "Frozen Goods", 2, 1000), ("Bread", "Bakery", 1.50, 200), ("T-shirt", "Clothing", 10, 500), ("Gift-card", "Cards", 10, 12)