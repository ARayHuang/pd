const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const { validator } = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkBody = validator.compile({
	profilePictureId: userValidationSchema.profilePictureId,
	shiftType: {
		...userValidationSchema.shiftType,
		optional: false,
	},
	channelIds: {
		...userValidationSchema.channelIds,
		min: 1,
	},
	displayName: userValidationSchema.displayName,
	password: userValidationSchema.password,
	username: userValidationSchema.username,
});

module.exports = (req, res, next) => {
	if (req.query.via !== 'manager') {
		return next('route');
	}

	const result = checkBody(req.body);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		USER_INVALID_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
