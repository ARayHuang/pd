const { ENUM_USER_TYPE } = require('../../../../lib/enum');

module.exports = (req, res, next) => {
	if (
		req.query.channelName === undefined ||
		req.query.type !== ENUM_USER_TYPE.STAFF
	) {
		return next();
	}

	res.locals.channelName = req.query.channelName;

	next();
};
