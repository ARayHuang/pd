const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isChannelIdExisted = require('./is-channel-id-existed');

exports.before = compose([
	validateRequestPayload,
	isChannelIdExisted,
]);
