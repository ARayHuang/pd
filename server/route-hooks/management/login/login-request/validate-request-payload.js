const { RequestValidationError } = require('ljit-error');
const { INVALID_AUTH_REQUEST } = require('../../../../lib/error/code');
const { validator } = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkBody = validator.compile({
	username: userValidationSchema.username,
	password: userValidationSchema.password,
});

module.exports = (req, res, next) => {
	const result = checkBody(req.body);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		INVALID_AUTH_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
