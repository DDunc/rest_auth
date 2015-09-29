var express = require('express');
var userAgent = require(__dirname + "/../models/useragent");
var userAgentLogger = require(__dirname + "/../lib/useragent_logger");

var userAgentRoute = module.exports = exports = express.Router();

userAgentRoute.get('/', function(req, res) {
  userAgentLogger(req, res, function(req, res) {
    userAgent.find({}, function(err, data) {
      if (err) console.log(err);
      res.json(data);
    });
  });
});