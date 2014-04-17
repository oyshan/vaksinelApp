//set up ===============================================
var express = require('express');
var morgan = require('morgan'); //logger
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app 	= express(); //create app w/ express
var mongoose = require('mongoose'); //mongoose for mongodb

//CONFIGURATION
// ===============================================================

mongoose.connect('localhost:27017/todo3'); //connect to mongoDB

app.use(express.static(__dirname+'/public')); //set the static files location
app.use(morgan('dev')); //log every request to the console
app.use(bodyParser()); //pull information from html in POST
app.use(methodOverride()); //simulate DELETE and PUT

// define model =================
	var Todo = mongoose.model('Todo', {
		text : String
	});

// ROUTES
// ================================================================
// get an instance of router
var router = express.Router();

// route middleware that will happen on every request
router.use(function(req, res, next) {
	// continue doing what we were doing and go to the route
	next();	
});

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

//application
app.get('*',function(req,res){
	//load the single view file (angular will handle the page changes on the front-end)
	res.sendfile('./public/index.html');
});

//Start server
app.listen(8080);
console.log("App listening on port 8080");