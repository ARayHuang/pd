const {
	validator,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkBody = validator.compile({
	body: userValidationSchema.channelSettings,
});

module.exports = (req, res, next) => {
	const bodyResult = checkBody(req);

	if (bodyResult !== true) {
		return next(
			new RequestValidationError(
				USER_INVALID_REQUEST.CODE,
				refactorErrors(bodyResult),
			),
		);
	}

	next();
};
