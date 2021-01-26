const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const commentValidationSchema = require('../../../../lib/validations/schemas/comment');
const checkParams = validator.compile({
	channelId: generateIdSchema(),
	orderId: generateIdSchema(),
});
const checkBody = validator.compile({
	content: commentValidationSchema.content,
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(paramsResult),
		));
	}

	const bodyResult = checkBody(req.body);

	if (bodyResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(bodyResult),
		));
	}

	next();
};
