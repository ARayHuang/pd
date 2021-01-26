const {
	validator,
	generatePaginationSchema,
	generateIdSchema,
	generateDateSchema,
} = require('../../../../lib/validations');
const orderValidationSchema = require('../../../../lib/validations/schemas/order');
const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkQuery = validator.compile({
	...generatePaginationSchema(['createdAt']),
	from: generateDateSchema(),
	to: generateDateSchema(),
	status: {
		type: 'multi',
		rules: [
			orderValidationSchema.status,
			{
				type: 'array',
				unique: true,
				items: orderValidationSchema.status,
			},
		],
	},
	handlerId: {
		...generateIdSchema(),
		optional: true,
	},
	description: {
		...orderValidationSchema.description,
		optional: true,
	},
	customerName: {
		...orderValidationSchema.customerName,
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

	if (!Array.isArray(req.query.status)) {
		req.query.status = [req.query.status];
	}

	next();
};
