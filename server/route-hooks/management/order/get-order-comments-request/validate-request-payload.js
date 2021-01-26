const {
	validator,
	generateIdSchema,
	generatePaginationSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	orderId: generateIdSchema(),
});
const checkQuery = validator.compile(generatePaginationSchema(['createdAt']));

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(paramsResult),
		));
	}

	const queryResult = checkQuery(req.query);

	if (queryResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(queryResult),
		));
	}

	next();
};
