const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { ORDER_INVALID_REQUEST } = require('../../../../lib/error/code');
const { RequestValidationError } = require('ljit-error');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	invitationId: generateIdSchema(),
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(new RequestValidationError(
			ORDER_INVALID_REQUEST.CODE,
			refactorErrors(paramsResult),
		));
	}

	next();
};
