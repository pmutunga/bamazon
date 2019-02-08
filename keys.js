var mysql = require('mysql');

var connection = mysql.bootcamp({
	host:"127.0.0.1",
	port:3306,
	user:"root",
	password:"Coding123",
	database:"bamazon"
});

module.exports = connection;