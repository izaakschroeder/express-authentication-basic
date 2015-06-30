
var path = require('path'),
	express = require('express'),
	authentication = require('express-authentication'),
	basic = require(path.join(__dirname, '..'));


var app = express(),
	auth = authentication();

var login = auth.for(basic(function verify(data, callback) {
	if (data.username === 'admin' && data.password === 'admin') {
		callback(null, true, { name: 'Fred' });
	} else {
		callback(null, false);
	}
}));

app.use(auth);
app.use(login);

app.get('/', function index(req, res) {
	res.status(200).send({ message: 'Hello' });
});

app.get('/secret', login.required(), function secret(req, res) {
	// var info = login.of(req);
	res.status(200).send({ message: 'Secret' });
});

app.listen(process.env.PORT || 5553);
