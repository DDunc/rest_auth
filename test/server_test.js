var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var url = 'localhost:3000/api';
process.env.MONGO_URL = 'mongodb://localhost/agt';
var userAgent = require(__dirname + "/../models/useragent");
chai.use(chaiHttp);
require(__dirname + '/../server.js');

describe('the useragent resource', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) console.log(err);
      done();
    });
  });

  it('should retrieve the associated user-agent value', function(done) {
    chai.request(url)
      .get('/')
      .end(function(err, res) {
        console.log(res.body);
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });
  describe('db return', function() {
    var dbResults;
    before(function(done) {
      userAgent.find({'userAgent': 'node-superagent/0.19.1'}, function(err, docs) {
        dbResults = docs;
        console.log(dbResults);
        done();
      });
    });
    it('should have the record of the last associated user-agent', function(done) {
    chai.request(url)
      .get('/useragent')
      .end(function(err, res) {
        expect(dbResults).to.not.eql([]);
        done();
      });
    });
  });
});