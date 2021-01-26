const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const prepareInvitation = require('./prepare-invitation');
const prepareOrder = require('./prepare-order');
const { prepareChannelIdsIfUserTypeIsStaff } = require('../../../common');
const deleteOrderOperationRecord = require('./delete-order-operation-record');
const {
	createOrderOperationRecord,
} = require('../../../order.common');
const { ENUM_ORDER_OPERATION_TYPE } = require('../../../../lib/enum');
const { createLog } = require('../../../common');
const prepareLog = require('./prepare-log');

exports.before = compose([
	validateRequestPayload,
	prepareInvitation,
	prepareChannelIdsIfUserTypeIsStaff,
	prepareOrder,
	prepareLog,
]);

exports.after = compose([
	deleteOrderOperationRecord,
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.SUBSCRIBED_ORDER),
	createLog,
]);
