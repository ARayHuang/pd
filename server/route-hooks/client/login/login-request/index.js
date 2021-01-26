const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const { authenticateLoginCredentials } = require('../../../authentication');

exports.before = compose([
	validateRequestPayload,
	authenticateLoginCredentials,
]);
