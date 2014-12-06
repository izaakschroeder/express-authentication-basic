
'use strict';

var _ = require('lodash'),
	authHeader = require('auth-header');

function parse(auth) {
	var parts = new Buffer(auth.token, 'base64').toString('utf8').split(':', 2);
	return _.assign(auth.params, {
		username: parts[0],
		password: parts[1]
	});
}

/**
 * Create HTTP Basic authentication middleware.
 * @param {Function} checkPassword Function to call to verify
 * @returns {Function} Middleware for authentication.
 */
function basicAuthenticator(checkPassword) {

	// Make sure checkPassword is a function
	if (!_.isFunction(checkPassword)) {
		throw new TypeError();
	}

	return function basicAuthentication(req, res, next) {

		res.set('WWW-Authenticate', authHeader.format('Basic'));

		var auth = authHeader.parse(req.get('authorization'));

		var challenge = parse(auth);

		req.challenge = challenge;

		checkPassword(challenge, function done(err, status, result) {

			if (err) {
				return next(err);
			}

			req.authenticated = status;
			req.authentication = result;

			next();
		});
	};
}

module.exports = basicAuthenticator;
