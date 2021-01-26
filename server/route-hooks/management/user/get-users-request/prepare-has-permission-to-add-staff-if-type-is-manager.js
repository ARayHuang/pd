const { ENUM_USER_TYPE } = require('../../../../lib/enum');

module.exports = (req, res, next) => {
	if (
		req.query.hasPermissionToAddStaff === undefined ||
		req.query.type !== ENUM_USER_TYPE.MANAGER
	) {
		return next();
	}

	res.locals.hasPermissionToAddStaff = (req.query.hasPermissionToAddStaff === 'true');

	next();
};
