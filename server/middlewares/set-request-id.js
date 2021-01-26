const uuid = require('uuid');

module.exports = (req, res, next) => {
	if (!req.header('X-Request-Id')) {
		req.headers['x-request-id'] = uuid.v4();
	}

	next();
};
