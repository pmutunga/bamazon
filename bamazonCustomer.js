// Define Dependencies

var mysql = require("mysql"); //mySQL DB
var inquirer = require("inquirer"); //inquirer npm package used for prompts
//var connection = require('./keys.js'); //securely saves DB info.

//Connect to DB. This is critical for the app to work

var connection = mysql.createConnection({
  host: "localhost",
  user: "bamazon",
  password: "Coding123",
  database: "bamazon_DB"
});

//Define variables
var sql = " ";

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
// run the start function after the connection is made to prompt the user
  displayProd();
   
});

//first display all of the items available for sale, including the ids, names, and prices of products for sale.

var displayProd = function(){
  console.log("Selecting all products...\n");
  sql = "SELECT * FROM products WHERE stock_quantity > 0";
  connection.query(sql, function(err, res) {
    if (err) throw err;
      // Log all results of the SELECT statement
      //console.log(res);
        console.log("---------------The following products are availabe for purchase--------------------");
        console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
        console.log("ID" + " | " + "Product Name" + " | " + "Department" + " | " + "Price" + " | " + "Quantity");
        console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
        for(var i =0; i<res.length; i++){
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        console.log("-----------------------------------");   
      }
      console.log("Time to shop");
      shopItems();
    });
  }

  //Prompt user to choose item to buy
  var shopItems = function(){
    sql = "SELECT * FROM products WHERE stock_quantity > 0";
    console.log("Choose a Product to buy");
    //query databse to get product items
         
    connection.query(sql, function(err, res) {
    if (err) throw err;
    //console.log(res);
      
    //User inquirer to prompt user
    inquirer
    .prompt([
      {
        name: "product",
        type: "list",
        message: "What would you like to buy?",
        choices: function() { //pick items to chose from sql query.
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
          }
          return choiceArray;
        },
         },
      {
        name:"quantity",
        type: "input",
        message: "How many would you like?"
      }
    ]) //end of inquirer prompt
    .then(function(answer){
      //console.log(answer.product);
      //console.log(answer.quantity);
      sql = "SELECT * FROM products WHERE ?",
      
      connection.query(sql, {product_name: answer.product}, function(err, res) {
        if (err) throw err;
        var stockLeft = parseInt(res[0].stock_quantity, 10) - parseInt(answer.quantity,10);
        console.log(stockLeft);
        //var sales = parseInt(res[0].product_sales) + parseInt(answer.quantity);
        if(stockLeft < 0) {
          console.log("Insufficient products!");
          continueShopping();
        } else {
          var purchasePrice = answer.quantity*res[0].price;
          console.log("Your purchase price for " + answer.quantity + "  " + answer.product + " is " + purchasePrice);
          
          var sales = res[0].product_sales + purchasePrice;
          //update qunatities in SQL db
         
          sql = "UPDATE products SET ? , ? WHERE ?",
          connection.query(sql, [{stock_quantity: stockLeft},{product_sales:sales},{product_name:answer.product}], function(err, res) {
            if (err) throw err;
            
            console.log(res.affectedRows + " products updated!\n");
            continueShopping(); //find out how to delay
          }); //end of SQL update
          
        } //end of else
      }); //end of product search query
    
    }); //end of sql query


    }); //end of call-back

 
  }//end of shopItems()

  var continueShopping = function(){
    inquirer
    .prompt ({
      name: "action",
      type: "list",
      message: "Continue shopping?",
      choices: ["YES", "NO"]
    })
    .then(function(answer){
      if(answer.action === "NO"){
        console.log("Thank you for shopping with us")
        connection.end();
        
      } else {
                displayProd();
      }
    })
  }