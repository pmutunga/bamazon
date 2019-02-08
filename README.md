#Bamazon

Welcome to Bamazon - a unique Command Line Instruction(CLI)-based shopping experience.

* Customers - shop for the latest products!
* Managers - view low inventory items and restock!
* Supervisers - review your P&L reports for each department and see the best performing ones!

## How it works

Bamazon s an Amazon-like storefront built with MySQL. It allows customers to take in orders and depletes stock from the inventory. The app tracks product sales across store's departments and provides a summary of the highest-grossing departments in the store.

This is a mySQL assignment completed in Week 12 of the UoT Coding bootcamp

## Built with

* Node.js
* MySQL
* Inquirer

## How I built it

### Customer View

 - Create MySQL database, bamazon
 - Create table in bamazon called products. Products has the following columns:
   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)
- Populate products table with at least 10 products.
- Create a Node application called `bamazonCustomer.js`. Running this application first displays all of the items available for sale, including the ids, names, and prices of products for sale.
- Use Inquirer todisplay user prompts:
   * Ask the ID of the product they would like to buy.
   * Ask how many units of the product they would like to buy.
-  Once the customer has placed the order, application checks if there is enough stock of the product to meet the customer's request. If not, the app displays the message `Insufficient quantity!`, and then prevents the order from going through. The app asks the user if they would like to continue shopping.
- If the store has enough of the product, the app displays to the user to total cost of the purchase and then updates the DB to display remaining quantity.