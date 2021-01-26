const { compose } = require('compose-middleware');
const validateRequestPayload = require('./validate-request-payload');
const validateChannelIdsIfTypeIsStaff = require('./validate-channel-ids-if-type-is-staff');
const isChannelIdsExisted = require('./is-channel-ids-existed');

exports.before = compose([
	validateRequestPayload,
	validateChannelIdsIfTypeIsStaff,
	isChannelIdsExisted,
]);
