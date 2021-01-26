const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const { validateUserChannelIfTypeIsStaff } = require('../../../channel.common');

exports.before = compose([
	validateRequestPayload,
	validateUserChannelIfTypeIsStaff,
]);
