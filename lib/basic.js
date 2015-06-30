
var _ = require('lodash'),
	header = require('express-authentication-header');

function parse(auth) {
	var parts = new Buffer(auth.token, 'base64').toString('utf8').split(':', 2);
	return _.assign(auth, {
		username: parts[0],
		password: parts[1]
	});
}

function simple(username, password) {
	return function check(challenge, callback) {
		var valid =
			(!username || challenge.username === username) &&
			challenge.password === password;
		callback(
			null,
			valid,
			valid ? { user: challenge.username } : { }
		);
	};
}

module.exports = function create(options) {
	if (_.isFunction(options)) {
		options = {
			verify: options
		};
	} else if (_.isString(options)) {
		options = {
			verify: arguments.length > 1 ?
				simple(arguments[0], arguments[1]) :
				simple(null, arguments[0])
		};
	}
	return header(_.assign({
		scheme: 'Basic',
		parse: parse
	}, options));
};
