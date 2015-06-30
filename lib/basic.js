
var _ = require('lodash'),
	header = require('express-authentication-header');

function parse(auth) {
	var parts = new Buffer(auth.token, 'base64').toString('utf8').split(':', 2);
	return _.assign(auth, {
		username: parts[0],
		password: parts[1]
	});
}

module.exports = function create(options) {
	if (_.isFunction(options)) {
		options = {
			verify: options
		};
	}
	return header(_.assign({
		scheme: 'Basic',
		parse: parse
	}, options));
};
