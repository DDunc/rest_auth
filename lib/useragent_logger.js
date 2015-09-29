var UserAgent = require(__dirname + "/../models/useragent");

module.exports = function(req, res, callback) {
  var agt = req.headers['user-agent'];
  // if the users ip isn't in the database, add it.
  UserAgent.find({ 'userAgent': agt }, function(err, docs) {
    if (err) console.log(err);
    if(!docs.length) {
      var agtLog = new UserAgent({ 'userAgent': agt });
      agtLog.save();
    }
  });
  UserAgent.update({ 'userAgent': agt }, callback(req, res));
}