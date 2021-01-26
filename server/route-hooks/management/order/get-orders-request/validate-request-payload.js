const {
	validator,
	generatePaginationSchema,
	generateDateSchema,
} = require('../../../../lib/validations');
const orderValidationSchema = require('../../../../lib/validations/schemas/order');
const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkQuery = validator.compile({
	...generatePaginationSchema,
	to: generateDateSchema(),
	from: generateDateSchema(),
	customerName: {
		...orderValidationSchema.customerName,
		optional: true,
	},
	description: {
		...orderValidationSchema.description,
		optional: true,
	},
});

module.exports = (req, res, next) => {
	const queryResult = checkQuery(req.query);

	if (queryResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(queryResult),
		));
	}

	next();
};
