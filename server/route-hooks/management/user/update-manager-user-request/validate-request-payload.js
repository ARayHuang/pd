const {
	validator,
	generateIdSchema,
	checkParametersHasOneNotEmpty,
} = require('../../../../lib/validations');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	userId: generateIdSchema(),
});
const checkBody = validator.compile({
	hasPermissionToAddStaff: {
		...userValidationSchema.hasPermissionToAddStaff,
		optional: true,
	},
	profilePictureId: {
		...userValidationSchema.profilePictureId,
		optional: true,
	},
	displayName: {
		...userValidationSchema.displayName,
		optional: true,
	},
	password: {
		...userValidationSchema.password,
		optional: true,
	},
});

module.exports = (req, res, next) => {
	if (req.query.via !== 'admin') {
		return next('route');
	}

	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(
			new RequestValidationError(
				USER_INVALID_REQUEST.CODE,
				refactorErrors(paramsResult),
			),
		);
	}

	const bodyResult = checkBody(req.body);

	if (bodyResult !== true) {
		return next(
			new RequestValidationError(
				USER_INVALID_REQUEST.CODE,
				refactorErrors(bodyResult),
			),
		);
	}

	const {
		profilePictureId, displayName, password,
		hasPermissionToAddStaff,
	} = req.body;
	const result = checkParametersHasOneNotEmpty({
		profilePictureId, displayName, password,
		hasPermissionToAddStaff,
	});

	if (result !== true) {
		return next(
			new RequestValidationError(
				USER_INVALID_REQUEST.CODE,
				refactorErrors(result),
			),
		);
	}

	next();
};
