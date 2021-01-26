const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { TAG_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const tagValidationSchema = require('../../../../lib/validations/schemas/tag');
const checkParams = validator.compile({
	tagId: generateIdSchema(),
});
const checkBody = validator.compile({
	status: tagValidationSchema.status,
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(
			new RequestValidationError(
				TAG_INVALID_REQUEST.CODE,
				refactorErrors(paramsResult),
			),
		);
	}

	const bodyResult = checkBody(req.body);

	if (bodyResult !== true) {
		return next(
			new RequestValidationError(
				TAG_INVALID_REQUEST.CODE,
				refactorErrors(bodyResult),
			),
		);
	}

	next();
};
