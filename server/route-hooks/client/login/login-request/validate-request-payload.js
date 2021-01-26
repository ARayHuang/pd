const { validator } = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkBody = validator.compile({
	username: userValidationSchema.username,
	password: userValidationSchema.password,
});

module.exports = (req, res, next) => {
	const result = checkBody(req.body);

	if (result !== true) {
		return next(new RequestValidationError(
			USER_INVALID_REQUEST.CODE,
			refactorErrors(result),
		));
	}

	next();
};
