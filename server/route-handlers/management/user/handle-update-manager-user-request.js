const {
	USER_PROJECTIONS,

	updateMangerUserById,
} = require('../../../services/user');
const { NotFoundError } = require('ljit-error');
const { USER_NOT_FOUND } = require('../../../lib/error/code');

module.exports = async (req, res, next) => {
	const { userId } = req.params;
	const {
		profilePictureId, displayName, password,
		hasPermissionToAddStaff,
	} = req.body;

	try {
		const result = await updateMangerUserById(userId, {
			profilePictureId,
			displayName,
			password,
			hasPermissionToAddStaff,
		}, {
			projections: USER_PROJECTIONS.ID,
		});

		if (result === null) {
			throw new NotFoundError(
				USER_NOT_FOUND.MESSAGE,
				USER_NOT_FOUND.CODE,
			);
		}

		res.status(204).end();
	} catch (error) {
		next(error);
	}
};
