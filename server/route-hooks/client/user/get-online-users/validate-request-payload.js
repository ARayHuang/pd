const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { USER_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkQuery = validator.compile({
	channelId: {
		...generateIdSchema(),
		optional: true,
	},
});

module.exports = (req, res, next) => {
	if (req.query.isOnline !== 'true') {
		return next('route');
	}

	const checkResult = checkQuery(req.query);

	if (checkResult === true) {
		return next();
	}

	next(
		new RequestValidationError(
			USER_INVALID_REQUEST.CODE,
			refactorErrors(checkResult),
		),
	);
};
