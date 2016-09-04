//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var mongoose = require('mongoose');

// var uristring =
    //process.env.MONGOLAB_URI ||
    //process.env.MONGOHQ_URL ||
    //'mongodb://localhost/instapoesia_db'
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

/// My resources, not all the shit you see
var fragments = require( './routes/fragments.js' );
var users = require( './routes/users.js' );

//mongoose.connect( 'mongodb://instapoesia_admin:%Ralogu2@ds015690.mlab.com:15690/heroku_0vz3fpjs' );
mongoose.connect( 'mongodb://localhost:27017/instapoesia_deb_db_2' )
router.use(express.static(path.resolve(__dirname, 'client')));

router.use(passport.initialize());
router.use(passport.session());

// The fragments routes
router.use( '/api/write', fragments );
router.use( '/api/auth', users );

var messages = [];
var sockets = [];

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
