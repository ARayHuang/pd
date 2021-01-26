const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const {
	ENUM_USER_TYPE,
} = require('../../../../lib/enum');
const {
	validator,
	generatePaginationSchema,
	generateIdSchema,
} = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const channelValidationSchema = require('../../../../lib/validations/schemas/channel');
const getUsersQueryValidationSchema = {
	...generatePaginationSchema(['createdAt']),
	shiftType: {
		...userValidationSchema.shiftType,
		optional: true,
	},
	channelId: {
		...generateIdSchema(),
		optional: true,
	},
	channelName: {
		...channelValidationSchema.name,
		optional: true,
	},
	displayName: {
		...userValidationSchema.displayName,
		optional: true,
	},
	username: {
		...userValidationSchema.username,
		optional: true,
	},
	type: userValidationSchema.type,
	departmentType: userValidationSchema.departmentType,
	hasPermissionToAddStaff: {
		...userValidationSchema.hasPermissionToAddStaff,
		optional: true,
		type: 'string',
		enum: ['true', 'false'],
	},
};

module.exports = (req, res, next) => {
	let checkQuery;

	if (req.user.type === ENUM_USER_TYPE.ADMIN) {
		getUsersQueryValidationSchema.type.enum = [
			ENUM_USER_TYPE.MANAGER,
			ENUM_USER_TYPE.STAFF,
		];
		getUsersQueryValidationSchema.departmentType.optional = req.query.type === ENUM_USER_TYPE.MANAGER;

		checkQuery = validator.compile(getUsersQueryValidationSchema);
	} else {
		getUsersQueryValidationSchema.type.enum = [ENUM_USER_TYPE.STAFF];

		checkQuery = validator.compile(getUsersQueryValidationSchema);
	}

	const result = checkQuery(req.query);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		USER_INVALID_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
