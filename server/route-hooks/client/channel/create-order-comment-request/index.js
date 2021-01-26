const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isOrderCommentExceeded = require('./is-order-comment-exceeded');
const { ORDER_PROJECTIONS } = require('../../../../services/order');
const {
	ENUM_ORDER_STATUS,
	ENUM_ORDER_OPERATION_TYPE,
} = require('../../../../lib/enum');
const { validateUserChannelIfTypeIsStaff } = require('../../../channel.common');
const {
	prepareOrder,
	validateOrderStatus,
	hasPermissionToCreateOrderComment,
	createOrderOperationRecord,
} = require('../../../order.common');

exports.before = compose([
	validateRequestPayload,
	prepareOrder(ORDER_PROJECTIONS.CREATE),
	validateUserChannelIfTypeIsStaff,
	validateOrderStatus([
		ENUM_ORDER_STATUS.CREATED,
		ENUM_ORDER_STATUS.ACCEPTED,
		ENUM_ORDER_STATUS.TRACKED,
		ENUM_ORDER_STATUS.RESOLVED,
	]),
	hasPermissionToCreateOrderComment,
	isOrderCommentExceeded,
]);

exports.after = compose([
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.CREATED_COMMENT),
]);
