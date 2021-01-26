const { ENUM_TAG_STATUS } = require('../../../../lib/enum');

module.exports = (req, res, next) => {
	const status = req.query.status === undefined ?
		[ENUM_TAG_STATUS.ACTIVE, ENUM_TAG_STATUS.DISABLED] :
		[req.query.status];

	res.locals.status = status;

	next();
};
