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
        choices: ["View Products by Sales Department", "Create a New Department", "Exit"]
    })
    .then(function(answer){ // Run relevant application based on choice

    // The switch-case will direct which function gets run.
    switch (answer.action) {
        case "View Products by Sales Department":
        displayDeptSales();
        break;
        
        case "Create a New Department":
        addNewDept();
        break;

        case "Exit":
        connection.end();
        break;

        }//end of switch
    }); //end of call-back

    } // end of displayMenu

// display a summarized table of sales by department

var displayDeptSales = function(){
  console.log("Selecting all products...\n");
 sql = "SELECT " +  
  "department_id" + "," +
  "department_name" + "," +
  "over_head_costs" + "," +
  "product_sales" + "," +
  "SUM(product_sales - over_head_costs) total_profit" + " " +
  "FROM" +  " " +
  "products as T1" +  " " +
  "INNER JOIN" +  " " +
  "departments AS T2 USING (department_name)" +  " " +
  "GROUP BY department_name";
 // console.log(sql);
  connection.query(sql,function(err, res) {
    if (err) throw err;
      // Log all results of the SELECT statement
      //console.log(res);
        console.log("---------------Sales by department--------------------");
        console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
        console.log("department_ID" + " | " + "Department Name" + " | " + "over_head_costs" + " | " + "product_sales" + " | " + "total_profit");
        console.log("--" + " | " + "------------" + " | " + "----------" + " | " + "-----" + " | " + "--------");
        for(var i =0; i<res.length; i++){
        console.log(res[i].department_id + "       | " + res[i].department_name + "      | " + res[i].over_head_costs + "         | " + res[i].product_sales + "           | " + res[i].total_profit);
        console.log("-----------------------------------");   
      }
      displayMenu();
    });
  }

  //Display items with stock_quantity less than 5, including the ids, names, and prices of products for sale.


    // Add a new department
  //Prompt user to add a new department
  var addNewDept = function(){
   
    console.log("Add a new department");

    //User inquirer to prompt user
    inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "What's the name of your new department?",
       },
      {
        name:"over_head_costs",
        type: "input",
        message: "What are the over head costs>"
      }

    ]) //end of inquirer prompt
    .then(function(answer){
      //console.log(answer.product);
      //console.log(answer.quantity);
      
          //update qunatities in SQL db
          sql = "INSERT INTO departments SET ?",
          connection.query(sql,             {
                department_name:answer.department_name,
                over_head_costs:answer.over_head_costs,

            }, 
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " departments updated!\n");
            displayMenu(); 
          }); //end of SQL update
          
    
    }); //end of call-back
  }//end of addInventory() 

