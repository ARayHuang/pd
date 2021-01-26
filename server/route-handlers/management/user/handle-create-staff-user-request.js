const { pick } = require('lodash');
const { ConflictError } = require('ljit-error');
const {
	USER_DUPLICATED,
} = require('../../../lib/error/code');
const {
	createStaffUser,
} = require('../../../services/user');

module.exports = async (req, res, next) => {
	try {
		const user = await createStaffUser({
			...req.body,
			departmentType: req.user.departmentType,
		});
		const result = pick(user.toJSON(), [
			'id',
			'username',
			'displayName',
			'type',
			'departmentType',
			'profilePictureId',
			'shiftType',
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
