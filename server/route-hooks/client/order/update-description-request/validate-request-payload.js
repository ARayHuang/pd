const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const orderValidationSchema = require('../../../../lib/validations/schemas/order');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	orderId: generateIdSchema(),
});
const checkBody = validator.compile({
	description: orderValidationSchema.description,
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
