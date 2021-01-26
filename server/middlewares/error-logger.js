const logger = require('../lib/logger');

module.exports = function (error, req, res, next) {
	logger.error(error, {
		requestId: req.headers['x-request-id'],
		user: req.user && req.user.username,
	});

	next(error);
};
