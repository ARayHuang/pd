const { RequestValidationError } = require('ljit-error');
const { CHANNEL_INVALID_REQUEST } = require('../../../../lib/error/code');
const { validator } = require('../../../../lib/validations');
const refactorErrors = require('../../../../lib/error/refactorErrors');
const channelValidationSchema = require('../../../../lib/validations/schemas/channel');
const checkBody = validator.compile({
	name: channelValidationSchema.name,
});

module.exports = (req, res, next) => {
	const result = checkBody(req.body);

	if (result === true) {
		return next();
	}

	const error = new RequestValidationError(
		CHANNEL_INVALID_REQUEST.CODE,
		refactorErrors(result),
	);

	next(error);
};
