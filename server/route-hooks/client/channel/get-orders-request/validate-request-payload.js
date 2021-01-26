const { RequestValidationError } = require('ljit-error');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const {
	validator,
	generatePaginationSchema,
	generateIdSchema,
	generateDateSchema,
} = require('../../../../lib/validations');
const orderValidationSchema = require('../../../../lib/validations/schemas/order');
const userValidationSchema = require('../../../../lib/validations/schemas/user');
const checkParams = validator.compile({
	channelId: generateIdSchema(),
});
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
	owner: {
		...userValidationSchema.displayName,
		optional: true,
	},
	handler: {
		...userValidationSchema.displayName,
		optional: true,
	},
	tagId: {
		...generateIdSchema(),
		optional: true,
	},
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

	if (!Array.isArray(req.query.status)) {
		req.query.status = [req.query.status];
	}

	next();
};
