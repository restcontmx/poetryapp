
var express = require( 'express' );
var router = express();
var Book = require( '../models/books.js' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );

// application json parser
var jsonParser = bodyParser.json();

//
// create
//
router.post( '/', jsonParser, function(req, res){

    var book = new Book();
    // Dfine the variables to assign with the req.body.params.variable
    // Print just in createServer
    console.log( req.body );
    
    book.title = req.body.params.title;
    book.font = req.body.params.font;
    book.user = req.body.params.user;

    console.log( book );

    res.send( { 'message' : 'created', 'data' : book } );

});// End of create function

//
// List all the books not matter the user
//
router.get( '/', function( req, res ){

    Book.find( {}, function( err, books ){
        if (err)
        {
            res.json( { 'message' : 'error', 'err' : err } );
        }
        res.json( { 'message' : 'ok', 'data' : books } );
    }); // End of find function

});// End of Get all function

module.exports = router
