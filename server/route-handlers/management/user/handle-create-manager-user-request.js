const { pick } = require('lodash');
const { ConflictError } = require('ljit-error');
const {
	USER_DUPLICATED,
} = require('../../../lib/error/code');
const {
	createManagerUser,
} = require('../../../services/user');

module.exports = async (req, res, next) => {
	try {
		const user = await createManagerUser(req.body);
		const result = pick(user.toJSON(), [
			'id',
			'username',
			'displayName',
			'type',
			'departmentType',
			'profilePictureId',
			'hasPermissionToAddStaff',
		]);

		res.status(201).json(result);
	} catch (error) {
		if (error.code === 11000) {
			return next(new ConflictError(
				USER_DUPLICATED.MESSAGE,
				USER_DUPLICATED.CODE,
			));
		}

		next(error);
	}
};
