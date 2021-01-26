const { ENUM_USER_TYPE } = require('../../../../lib/enum');

module.exports = (req, res, next) => {
	if (
		req.query.channelId === undefined ||
		req.query.type !== ENUM_USER_TYPE.STAFF
	) {
		return next();
	}

	res.locals.channelId = req.query.channelId;

	next();
};
