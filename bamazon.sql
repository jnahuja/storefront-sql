CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
item_id INTEGER(11) auto_increment NOT NULL,
product VARCHAR(100) NOT NULL,
department VARCHAR(255),
price FLOAT(12,2),
stock_quantity INTEGER(11),
PRIMARY KEY(item_id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("Grill", "Backyard", 180, 25), ("Cornhole", "Backyard", 40, 40), ("Phone", "Electronics", 599.99, 80), ("Laptop", "Electronics", 1725, 60), ("Blazer", "Clothing", 220, 15), ("Pair of Socks (x3)", "Clothing", 10, 30), ("Deck Chair", "Backyard", 55, 20), ("Record Player", "Vintage", 240, 5), ("Telescope", "Vintage", 220, 3), ("Mona Lisa", "Vintage", 100000000, 1);

SELECT * FROM products;