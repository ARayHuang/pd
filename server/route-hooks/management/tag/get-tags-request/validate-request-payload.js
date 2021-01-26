const {
	validator,
	generatePaginationSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { TAG_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const tagValidationSchema = require('../../../../lib/validations/schemas/tag');
const checkQuery = validator.compile({
	sort: generatePaginationSchema(['createdAt']).sort,
	order: generatePaginationSchema().order,
	status: {
		...tagValidationSchema.status,
		optional: true,
	},
	name: {
		...tagValidationSchema.name,
		optional: true,
	},
});

module.exports = (req, res, next) => {
	const queryResult = checkQuery(req.query);

	if (queryResult !== true) {
		return next(new RequestValidationError(
			TAG_INVALID_REQUEST.CODE,
			refactorErrors(queryResult),
		));
	}

	next();
};
