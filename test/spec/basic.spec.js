
var express = require('express'),
	request = require('supertest'),
	basic = require('basic');

describe('basic', function() {

	beforeEach(function() {
		this.auth = basic(function(challenge, done) {
			if (challenge.username === 'bob') {
				done(null, true, { message: 'hello' });
			} else {
				done(null, false, { message: 'goodbye' });
			}
		});
		this.app = express();
		this.app.get('/', function hello(req, res, next) {
			res.status(200).send('OK');
			next();
		});
		this.app.use(this.auth);
	});

	it('should fail if no callback given', function() {
		expect(basic).to.throw(TypeError);
	});

	it('should fail if callback is not a function', function() {
		expect(function() {
			basic({ });
		}).to.throw(TypeError);
	});

	it('should call the callback with correct args', function() {
		// var stub = sinon.stub(),
		//	auth = basic(stub);
		// request(this.app).get('/');
	});

	it('should set the correct challenge', function(done) {
		this.app.use(function(req, res, next) {
			expect(req.challenge).to.deep.equal({
				username: 'sam',
				password: 'pee'
			});
			next();
		});
		request(this.app).get('/').auth('sam', 'pee').end(done);
	});

	it('should set authenticated correctly', function(done) {
		this.app.use(function(req, res, next) {
			expect(req.authenticated).to.equal(true);
			next();
		});
		request(this.app).get('/').auth('bob', 'xxx').end(done);
	});

	it('should set authenticated correctly', function(done) {
		this.app.use(function(req, res, next) {
			expect(req.authenticated).to.equal(false);
			next();
		});
		request(this.app).get('/').auth('billy', 'yyy').end(done);
	});

	it('should set authentication correctly', function(done) {
		this.app.use(function(req, res, next) {
			expect(req.authentication).to.deep.equal({ message: 'hello' });
			next();
		});
		request(this.app).get('/').auth('bob', 'xxx').end(done);
	});

	it('should pass on errors from verify function', function(done) {
		var auth = basic(function(challenge, cb) {
			cb({ status: 512 });
		});
		var app = express();
		app.use(auth);
		request(app).get('/').auth('bob', 'xxx').expect(512).end(done);
	});
});
