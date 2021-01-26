const {
	validator,
	generateIdSchema,
} = require('../../../../lib/validations');
const channelValidationSchema = require('../../../../lib/validations/schemas/channel');
const { RequestValidationError } = require('ljit-error');
const { CHANNEL_INVALID_REQUEST } = require('../../../../lib/error/code');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	channelId: generateIdSchema(),
});
const checkBody = validator.compile({
	name: channelValidationSchema.name,
});

module.exports = (req, res, next) => {
	const paramsResult = checkParams(req.params);

	if (paramsResult !== true) {
		return next(
			new RequestValidationError(
				CHANNEL_INVALID_REQUEST.CODE,
				refactorErrors(paramsResult),
			),
		);
	}

	const bodyResult = checkBody(req.body);

	if (bodyResult !== true) {
		return next(
			new RequestValidationError(
				CHANNEL_INVALID_REQUEST.CODE,
				refactorErrors(bodyResult),
			),
		);
	}

	next();
};
