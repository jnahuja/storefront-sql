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
    switch (action) {
        case "create":
            createSong();
            break;
        case "update":
            updateSong();
            break;
        case "delete":
            deleteSong();
            break;
        case "read":
            readProduct("newBid");
            break;
    }
});

function readProduct(bidTime) {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product + " | " + res[i].department + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        // connection.end();
        if (bidTime == "newBid") {
            promptForBid();
        }

        // TODO - Make the table prettier with "https://www.npmjs.com/package/cli-table"
    });
}

function promptForBid() {

    inquirer.prompt([{
        name: "productID",
        type: "input",
        message: "What is the ID of the product that you'd like to buy?"
        // ACTION - Turn this Product Bid Question into a list that is populated by the different products in the SQL table
    }, {
        name: "bidQuantity",
        type: "input",
        message: "How many of the quantity would you like to buy?"
    }]).then(function (answer) {
        console.log(answer.productID);
        console.log(answer.bidQuantity);
        var query = "SELECT * FROM products WHERE item_id=?"
        connection.query(query, [answer.productID], function (err, res) {

            // var query = "SELECT * FROM products WHERE item_id= answer.product";
            // connection.query(query, { artist: answer.artist }, function(err, res) {
            console.log(res);

            var updatedQuantity = res[0].stock_quantity - answer.bidQuantity
            if (updatedQuantity >= 0) {
                // if (res[0].stock_quantity > answer.bidQuantity) {
                
                console.log("YOU HAVE IT!");
                
                updateProduct(answer.productID, updatedQuantity);
                purchaseCost(answer.bidQuantity, res[0].price);

            } else {
                console.log("Not enough in stock");
            }

            //     for (var i = 0; i < res.length; i++) {
            //       console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
            //     }
            //     runSearch();
            //   });
        });
        // console.log(query.sql);
    });
}

function updateProduct(recordID, newQuantity) {
    console.log("Updating Product Quantities...\n");
    var query = "UPDATE products SET ? WHERE item_id=?"
    connection.query(query, [{stock_quantity: newQuantity},recordID], function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            // deleteSong();
        }
    );
    readProduct();
};

function purchaseCost(quantity, price) {
    var totalCost = quantity*price;
    console.log(`The total cost of your purchase is ${totalCost}`)

}

// function checkProductQuantity() {

// }

// inquirer.prompt([{
//     name: "userType",
//     type: "list",
//     message: "Are you a User or an Admin?",
//     choices: ["User", "Admin"],
// }]).then(function (answer1) {
//     if (answer1.userType == "User") {
//         inquirer.prompt([{
//             name: "name",
//             message: "What is your name?"
//         }, {
//             name: "location",
//             message: "Where would you like to know the weather?"
//         // },
//         // {
//         //     name: "date",
//         //     message: "And for what date?"
//         }]).then(function (answers) {

//             locationGlobal = answers.location;
//             dateGlobal = userSearch.formatDate();
//             // answers.date; // FIX

//             var user1 = new userSearch.newUser(
//                 answers.name,
//                 answers.location,
//                 dateGlobal // FIX
//             )

//             // console.log(user1);

//             var user1String = user1.userToString();
//             userSearch.appendLog(user1String);

//             console.log(user1String);

//             weatherFile.weatherFunction(answers.location);

//         });
//     }
//     else if (answer1.userType == "Admin") {
//         userSearch.adminPrint();
//     }
// });

// function createProduct() {
//   console.log("Inserting a new product...\n");
//   var query = connection.query(
//     "INSERT INTO songs SET ?",
//     {
//       name: "I See Fire",
//       genre: "Folk",
//       artist: "Ed Sheeran",
//       playlistID: 1,
//       rating:9 ,
//     },
//     // function(err, res) {
//     //   console.log(res.affectedRows + " product inserted!\n");
//     //   // Call updateProduct AFTER the INSERT completes
//     //   updateProduct();
//     // }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }


//   // logs the actual query being run
//   console.log(query.sql);
// }

// function deleteSong() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readSong();
//     }
//   );
// }

// function readSong() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }

// function queryAllSongs() {
