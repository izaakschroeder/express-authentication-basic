
var express = require('express'),
	auth = require('express-authentication'),
	basic = require('../'); // express-authentication-basic

var app = express();

app.use(basic('bob', 'secret'));
app.get('/', auth.required(), function respond(req, res) {
	res.status(200).send(auth.of(req));
});

app.listen(process.env.PORT || 5553);
