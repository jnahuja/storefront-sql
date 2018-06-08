var mysql = require("mysql");
var inquirer = require("inquirer");

var action = process.argv[2];
var record = process.argv[3];

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    managerOptions();
});


function managerOptions() {
    inquirer.prompt([{
        name: "options",
        type: "list",
        message: "Menu Options:",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
    }]).then(function (answer1) {

        if (answer1.options == "View Products for Sale") {
            viewProducts();
        }
        if (answer1.options == "View Low Inventory") {
            viewLowInventory();
        }
        if (answer1.options == "Add to Inventory") {
            addToInventory();
        }
        if (answer1.options == "Add New Product") {
            inquirer.prompt([{
                name: "newProduct",
                type: "input",
                message: "Name of Product"
            }, {
                name: "newDepartment",
                type: "input",
                message: "Department of Product"
            }, {
                name: "newPrice",
                type: "input",
                message: "Price of Product"
            }, {
                name: "newQuantity",
                type: "input",
                message: "Quantity of Product"
            }]).then(function (answer2) {
                addNewProduct(answer2.newProduct, answer2.newDepartment, answer2.newPrice, answer2.newQuantity);
            });
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product + " | " + res[i].department + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        // connection.end();

        // TODO - Make the table prettier with "https://www.npmjs.com/package/cli-table"
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<6", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product + " | " + res[i].department + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        // connection.end();

        // TODO - Make the table prettier with "https://www.npmjs.com/package/cli-table"
    });
}

function addToInventory() {

    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What is the ID for the product you would like to update?",
    }, {
        name: "quantity",
        type: "input",
        message: "How much of the product you would like to add?",
    }]).then(function (answer2) {

        // var initialQuantity
        var recordID = answer2.id;
        var additionalQuantity = answer2.quantity;
        console.log("Record ID = "+recordID);
        console.log("Quan = "+additionalQuantity);
        var query1 = "SELECT * FROM products WHERE item_id=?"
        connection.query(query1, [recordID], function (err, res) {
            // initialQuantity = res.stock_quantity;
            console.log(res);
            console.log("Quan2 = "+additionalQuantity);
            var updatedQuantity = res[0].stock_quantity + additionalQuantity;
            console.log("Record ID2 = "+recordID);
            console.log("Quan3 = "+updatedQuantity);
            updateProductQuantity(recordID, updatedQuantity);
        });
    
        // newQuantity += initialQuantity;
    });
}


function updateProductQuantity(recordID, newQuantity) {

    console.log("Updating Product Quantities...\n");
    var query2 = "UPDATE products SET ? WHERE item_id=?"
    connection.query(query2, [{
        stock_quantity: newQuantity
    }, recordID], function (err, res) {
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        // deleteSong();
    });
    viewProducts();
};

function addNewProduct(userProduct, userDepartment, userPrice, userQuantity) {

    // UPDATE
    console.log("Inserting a new product...\n");
    var query = "INSERT INTO products SET ?"
    connection.query(query,
    {
      product: userProduct,
      department: userDepartment,
      price: userPrice,
      stock_quantity: userQuantity,
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      // Call updateProduct AFTER the INSERT completes
    //   updateProduct();
    });
    viewProducts();
}

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.