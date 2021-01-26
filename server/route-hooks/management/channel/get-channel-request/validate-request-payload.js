const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { CHANNEL_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	channelId: generateIdSchema(),
});

module.exports = (req, res, next) => {
	const result = checkParams(req.params);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		CHANNEL_INVALID_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
