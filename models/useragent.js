var mongoose = require('mongoose');

var userAgentSchema = new mongoose.Schema({
  userAgent: String,
});

module.exports = mongoose.model('userAgent', userAgentSchema);