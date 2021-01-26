const {
	NotFoundError,
	ForbiddenError,
} = require('ljit-error');
const {
	USER_NOT_FOUND,
	USER_IS_FORBIDDEN,
} = require('../../lib/error/code');
const {
	ENUM_USER_TYPE,
} = require('../../lib/enum');
const {
	getActiveUserById,
} = require('../../services/user');

async function prepareManagedUser(req, res, next) {
	const { userId } = req.params;

	try {
		const user = await getActiveUserById(userId);

		if (user === null) {
			throw new NotFoundError(
				USER_NOT_FOUND.MESSAGE,
				USER_NOT_FOUND.CODE,
			);
		}

		res.locals.managedUser = user;
	} catch (error) {
		return next(error);
	}

	next();
}

/**
 * Rules:
 * 	1. admin can modify managers and staffs.
 * 	2. manager can modify same departmentType staffs.
 * @param {*} req
 * @param {{locals: {managedUser: UserModel}}} res
 * @param {function} next
 * @returns {*}
 */
function hasPermissionToManageUser(req, res, next) {
	const ALLOW_ADMIN_MODIFY_USER_TYPES = [
		ENUM_USER_TYPE.MANAGER,
		ENUM_USER_TYPE.STAFF,
	];
	const ALLOW_MANAGER_MODIFY_USER_TYPES = [
		ENUM_USER_TYPE.STAFF,
	];

	if (
		req.user.type === ENUM_USER_TYPE.ADMIN &&
		ALLOW_ADMIN_MODIFY_USER_TYPES.indexOf(res.locals.managedUser.type) >= 0
	) {
		return next();
	}

	if (
		req.user.type === ENUM_USER_TYPE.MANAGER &&
		ALLOW_MANAGER_MODIFY_USER_TYPES.indexOf(res.locals.managedUser.type) >= 0
	) {
		if (req.user.departmentType === res.locals.managedUser.departmentType) {
			return next();
		}
	}

	next(new ForbiddenError(USER_IS_FORBIDDEN.MESSAGE, USER_IS_FORBIDDEN.CODE));
}

function validateUserType(validUserTypes = []) {
	return function (req, res, next) {
		if (validUserTypes.includes(req.user.type)) {
			next();
		} else {
			next(new ForbiddenError(
				USER_IS_FORBIDDEN.MESSAGE,
				USER_IS_FORBIDDEN.CODE,
			));
		}
	};
}

function hasPermissionToAddStaff(req, res, next) {
	if (req.user.hasPermissionToAddStaff) {
		return next();
	}

	next(new ForbiddenError(
		USER_IS_FORBIDDEN.MESSAGE,
		USER_IS_FORBIDDEN.CODE,
	));
}

module.exports = {
	prepareManagedUser,
	hasPermissionToManageUser,
	validateUserType,
	hasPermissionToAddStaff,
};
