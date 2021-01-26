const { RequestValidationError } = require('ljit-error');
const { CHANNEL_INVALID_REQUEST } = require('../../../../lib/error/code');
const {
	validator,
	generatePaginationSchema,
} = require('../../../../lib/validations');
const channelSchema = require('../../../../lib/validations/schemas/channel');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkQuery = validator.compile({
	...generatePaginationSchema(['createdAt']),
	name: {
		...channelSchema.name,
		optional: true,
	},
});

module.exports = (req, res, next) => {
	const result = checkQuery(req.query);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		CHANNEL_INVALID_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
