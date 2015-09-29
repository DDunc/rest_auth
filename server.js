var http = require('http');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/agt');
// tokens encode and decode with this APP_SECRET to make sure we know
// those tokens actually came from our server.
process.env.APP_SECRET = process.env.APP_SECRET || 'helloNSA';

var userAgentRouter = require(__dirname + "/routes/useragent_route");
var usersRouter = require(__dirname + '/routes/users_routes');
var port = 3000;

app.use('/api', userAgentRouter);
app.use('/api', usersRouter);


app.listen(port, function() {
  console.log('I am listening on port ' + port);
});