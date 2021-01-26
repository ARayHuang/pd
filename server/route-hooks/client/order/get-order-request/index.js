const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const { prepareChannelIdsIfUserTypeIsStaff } = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	prepareChannelIdsIfUserTypeIsStaff,
]);
