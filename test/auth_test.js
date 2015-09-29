var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var expect = chai.expect;
process.env.MONGO_URL = 'mongodb://localhost/agt';
chai.use(chaiHttp);
require(__dirname + "/../server");
var User = require(__dirname + '/../models/user');
var eatauth = require(__dirname + "/../lib/eat_auth");
var httpBasic = require(__dirname + '/../lib/http_basic');
var url = 'localhost:3000/api';

describe('httpbasic', function() {
  it('should be able to parse with http basic', function() {
    var req = {
      headers: {
        authorization: 'Basic ' + (new Buffer('test:testing')).toString('base64')
      }
    };
    httpBasic(req, {}, function() {
      expect(typeof req.auth).to.eql('object');
      expect(req.auth.username).to.eql('test');
      expect(req.auth.password).to.eql('testing');
    });
  });
});

describe('auth', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to create a user', function(done) {
    chai.request(url)
      .post('/signup')
      .send({username: 'testuser', password: 'password'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.token).to.have.length.above(0);
        done();
      });
  });

  describe('user already in database', function() {
    before(function(done) {
      var user = new User();
      user.username = 'test';
      user.basic.username = 'test';
      user.generateHash('password', function(err, res) {
        user.save(function(err, data) {
          if (err) throw err;
          user.generateToken(function(err, token) {
            if (err) throw err;
            this.token = token;
            done();
          }.bind(this));
        }.bind(this));
      }.bind(this));
    });

    it('should be able to sign in', function(done) {
      chai.request(url)
        .get('/signin')
        .auth('test', 'password')
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.token).to.have.length.above(0);
          done();
        });
    });

    it('should be able to authenticat with eat auth', function(done) {
      var token = this.token;
      var req = {
        headers: {
          token: token
        }
      };

      eatauth(req, {}, function() {
        expect(req.user.username).to.eql('test');
        done();
      });
    });
  });
});