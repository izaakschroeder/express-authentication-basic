# express-authentication-basic

HTTP Basic support compatible with [express-authentication].

![build status](http://img.shields.io/travis/izaakschroeder/express-authentication-basic.svg?style=flat&branch=master)
![coverage](http://img.shields.io/coveralls/izaakschroeder/express-authentication-basic.svg?style=flat&branch=master)
![license](http://img.shields.io/npm/l/express-authentication-basic.svg?style=flat)
![version](http://img.shields.io/npm/v/express-authentication-basic.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/express-authentication-basic.svg?style=flat)

It's pretty cool.

With [express-authentication]:

```javascript
var express = require('express'),
	auth = require('express-authentication'),
	basic = require('express-authentication-basic');

var app = express();

app.use(basic('bob', 'secret'));
app.get('/', auth.required(), function respond(req, res) {
	res.status(200).send(auth.of(req));
});

app.listen(process.env.PORT || 5553);
```

Use custom callbacks:

```javascript
var login = basic(function verify(challenge, callback) {
	if (challenge.username === 'admin' && challenge.password === 'secret') {
		callback(null, true, { user: 'charles' });
	} else {
		callback(null, false, { error: 'INVALID_PASSWORD' });
	}
});
```

Standalone:

```javascript
var express = require('express'),
	basic = require('express-authentication-basic');

var app = express(),
	login = basic(function(challenge, callback) {
		if (challenge.username === 'admin' && challenge.password === 'secret') {
			callback(null, true, { user: 'charles' });
		} else {
			callback(null, false, { error: 'INVALID_PASSWORD' });
		}
	});;

app.use(login);
app.get('/', function(req, res) {
	if (req.authenticated) {
		res.status(200).send({ user: req.authentication.user });
	} else {
		res.status(401).send();
	}
});
```

[express-authentication]: https://github.com/izaakschroeder/express-authentication
