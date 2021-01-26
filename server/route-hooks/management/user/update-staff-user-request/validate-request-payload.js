const {
	validator,
	generateIdSchema,
	checkParametersHasOneNotEmpty,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkParams = validator.compile({
	userId: generateIdSchema(),
});
const checkBody = validator.compile({
	profilePictureId: {
		...userValidationSchema.profilePictureId,
		optional: true,
	},
	shiftType: {
		...userValidationSchema.shiftType,
		optional: true,
	},
	channelIds: {
		...userValidationSchema.channelIds,
		optional: true,
		min: 1,
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
	if (req.query.via !== 'manager') {
		next('route');
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
		profilePictureId, shiftType, channelIds,
		displayName, password,
	} = req.body;
	const result = checkParametersHasOneNotEmpty({
		profilePictureId,
		shiftType,
		channelIds,
		displayName,
		password,
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
