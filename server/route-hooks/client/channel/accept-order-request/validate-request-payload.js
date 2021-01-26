const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	orderId: generateIdSchema(),
	channelId: generateIdSchema(),
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(
			new RequestValidationError(
				USER_INVALID_REQUEST.CODE,
				refactorErrors(paramsResult),
			),
		);
	}

	next();
};
