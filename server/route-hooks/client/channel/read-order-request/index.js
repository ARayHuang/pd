const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	ORDER_PROJECTIONS,
} = require('../../../../services/order');
const {
	prepareOrder,
	hasPermissionToCreateReadRecord,
} = require('../../../order.common');
const { validateUserChannelIfTypeIsStaff } = require('../../../channel.common');

exports.before = compose([
	validateRequestPayload,
	validateUserChannelIfTypeIsStaff,
	prepareOrder(ORDER_PROJECTIONS.OWNER_HANDLER_AND_CHANNEL),
	hasPermissionToCreateReadRecord,
]);
