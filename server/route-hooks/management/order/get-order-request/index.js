const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');

exports.before = compose([
	validateRequestPayload,
]);
