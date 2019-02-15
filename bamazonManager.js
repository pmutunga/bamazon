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
var newQuantity; //will use this variable when adding stock
var current_stock;

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
// run the start function after the connection is made to prompt the user
  displayMenu();
   
});

//Display Menu

var displayMenu = function(){
inquirer
.prompt(
    {
        name: "action",
        type: "list",
        message: "What would you like to do today?",
        choices: ["View all Products", "View Low Inventory Products", "Add to Inventory", "Add New Product", "Delete a Product", "Exit" ]
    })
    .then(function(answer){ // Run relevant application based on choice

    // The switch-case will direct which function gets run.
    switch (answer.action) {
        case "View all Products":
        displayProd();
        break;
        
        case "View Low Inventory Products":
        displayLow();
        break;
        
        case "Add to Inventory":
        addInventory();
        break;
        
        case "Add New Product":
        addNew();
        break;

        case "Delete a Product":
        deleteProduct();
        break;

        case "Exit":
        connection.end();
        break;

        }//end of switch
    }); //end of call-back

    } // end of displayMenu

//first display all of the items available for sale, including the ids, names, and prices of products for sale.

var displayProd = function(){
  console.log("Selecting all products...\n");
  sql = "SELECT * FROM products";
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
      displayMenu();
    });
  }

  //Display items with stock_quantity less than 5, including the ids, names, and prices of products for sale.

var displayLow = function(){
    console.log("Selecting low inventory products...\n");
    sql = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(sql, function(err, res) {
      if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
          console.log("---------------The following products are running out--------------------");
          console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
          console.log("ID" + " | " + "Product Name" + " | " + "Department" + " | " + "Price" + " | " + "Quantity");
          console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
          for(var i =0; i<res.length; i++){
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
          console.log("-----------------------------------");   
        }
        console.log("Manage your products");
        displayMenu();
      });
    } //end of displayLow()
  
  // Add to Inventory
  //Use Inquirer to Prompt user to choose item to restock
  var addInventory = function(){
    console.log("Select a Product to replenish");
    sql = "SELECT * FROM products";
    //query databse to get product items
        
    connection.query(sql, function(err, res) { //SQl query #1
    if (err) throw err;
    //console.log(res);
      
    //User inquirer to prompt user
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "list",
        message: "Which product would you like to add?",
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
        message: "How many would you like to add?"
      }
    ]) //end of inquirer prompt
    .then(function(answer){
      console.log("Thank you. Let's replenish " + answer.product_name + " by: " + parseInt(answer.quantity));
      
      // add inventory
      sql = "SELECT * FROM products WHERE ?";
      connection.query(sql,{product_name:answer.product_name}, function(err, res){
      if (err) throw err;
     current_stock = parseInt(res[0].stock_quantity);
      console.log("Current stock for " + res[0].product_name + " is: " + current_stock);
      newQuantity = current_stock + parseInt(answer.quantity);
      console.log(newQuantity);

          //update quantities in SQL db
          sql = "UPDATE products SET ? WHERE ?",
          connection.query(sql, [{stock_quantity:newQuantity}, {product_name:answer.product_name}], function(err, res) {
           
            console.log(parseInt(newQuantity));  //question for TA - how to make this an Integer?
            
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            displayMenu(); 
          }); //end of SQL update
        }); //end of product search query
        }); //SQl add inventory query #1
    }); //end of call-back
  }//end of addInventory() 

    // Add a new product to Inventory
  //Prompt user to choose item to add
  var addNew = function(){
   
    console.log("Add a new product");

    //User inquirer to prompt user
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "Which product would you like to add?",
       },
      {
        name:"department_name",
        type: "input",
        message: "Which department?"
      },
      {
          name: "price",
          type: "input",
          message: "What's the price?"
      },
      {
          name: "quantity",
          type: "input",
          message: "How many?"
      }
    ]) //end of inquirer prompt
    .then(function(answer){
      //console.log(answer.product);
      //console.log(answer.quantity);
      
          //update qunatities in SQL db
          sql = "INSERT INTO products SET ?",
          connection.query(sql, 
            {
                product_name:answer.product_name,
                department_name:answer.department_name,
                price:answer.price,
                stock_quantity:answer.quantity
            }, 
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            displayMenu(); 
          }); //end of SQL update
          
    
    }); //end of call-back
  }//end of addInventory() 

    // Delete Products
  //Prompt user to choose item to delete
  var deleteProduct = function(){
    sql = "SELECT * FROM products";
    console.log("Select a Product to delete");
    //query database to get product items
         
    connection.query(sql, function(err, res) {
    if (err) throw err;
    //console.log(res);
      
    //User inquirer to prompt user
    inquirer
    .prompt([
      {
        name: "product",
        type: "list",
        message: "Which product would you like to delete?",
        choices: function() { //pick items to chose from sql query.
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].product_name);
          }
          return choiceArray;
        },
         },
      {
        name:"confirm",
        type: "list",
        message: "Are you sure?",
        choices: ["YES", "NO"]
      }
    ]) //end of inquirer prompt
    .then(function(answer){
      
      if(answer.action === "NO"){
        console.log("That's OK. What else would you like to do?")
        displayMenu(); 
        } else{
          //update qunatities in SQL db
          sql = "DELETE FROM products WHERE ?",
          connection.query(sql,  {product_name:answer.product}, function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            displayMenu(); 
          }); //end of SQL update
        } //end of else statement
        }); //end of sql query
    
    }); //end of call-back
  }//end of addInventory() 