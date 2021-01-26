const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isTagExceeded = require('./is-tag-exceeded');

exports.before = compose([
	validateRequestPayload,
	isTagExceeded,
]);
