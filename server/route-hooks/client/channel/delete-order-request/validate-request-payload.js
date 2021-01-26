const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const { RequestValidationError } = require('ljit-error');
const { ORDER_NOT_FOUND } = require('../../../../lib/error/code');
const checkParams = validator.compile({
	channelId: generateIdSchema(),
	orderId: generateIdSchema(),
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(new RequestValidationError(
			ORDER_NOT_FOUND.CODE,
			refactorErrors(paramsResult),
		));
	}

	next();
};
