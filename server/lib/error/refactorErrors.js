const logger = require('../logger');

module.exports = errors => {
	return errors.map(error => {
		logger.warn(error.message);
		return { param: error.field };
	});
};
