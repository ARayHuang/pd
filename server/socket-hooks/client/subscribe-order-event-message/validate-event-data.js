const {
	validator,
	generateIdSchema,
} = require('../../../lib/validations');
const { RequestValidationError } = require('ljit-error');
const { SOCKET_INVALID_REQUEST } = require('../../../lib/error/code');
const refactorErrors = require('../../../lib/error/refactorErrors');
const checkParams = validator.compile({
	id: {
		type: 'string',
		empty: false,
		max: 1024,
	},
	orderId: generateIdSchema(),
});

module.exports = (socket, data, next) => {
	const checkResult = checkParams(data);

	if (checkResult === true) {
		return next();
	}

	const error = new RequestValidationError(
		SOCKET_INVALID_REQUEST.CODE,
		refactorErrors(checkResult),
	);

	next(error);
};
