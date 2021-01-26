const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isChannelExceeded = require('./is-channel-exceeded');

exports.before = compose([
	validateRequestPayload,
	isChannelExceeded,
]);
