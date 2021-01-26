const { validator } = require('../../../../lib/validations');
const tagValidationSchema = require('../../../../lib/validations/schemas/tag');
const { RequestValidationError } = require('ljit-error');
const { TAG_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkBody = validator.compile({
	backgroundColor: tagValidationSchema.backgroundColor,
	fontColor: tagValidationSchema.fontColor,
	name: tagValidationSchema.name,
	status: tagValidationSchema.status,
});

module.exports = (req, res, next) => {
	const bodyResult = checkBody(req.body);

	if (bodyResult !== true) {
		return next(new RequestValidationError(
			TAG_INVALID_REQUEST.CODE,
			refactorErrors(bodyResult),
		));
	}

	next();
};
