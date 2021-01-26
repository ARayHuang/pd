const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const hasPermissionToDeleteOrderFile = require('./has-permission-to-delete-order-file');
const {
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
} = require('../../../channel.common');
const {
	prepareOrderFile,
	isOrderExisted,
} = require('../../../order.common');

exports.before = compose([
	validateRequestPayload,
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
	isOrderExisted,
	prepareOrderFile(),
	hasPermissionToDeleteOrderFile,
]);
