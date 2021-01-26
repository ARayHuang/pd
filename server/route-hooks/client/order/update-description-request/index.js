const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	prepareChannelIdsIfUserTypeIsStaff,
	createLog,
} = require('../../../common');
const { createOrderOperationRecord } = require('../../../order.common');
const { ENUM_ORDER_OPERATION_TYPE } = require('../../../../lib/enum');
const prepareLog = require('./prepare-log');

exports.before = compose([
	validateRequestPayload,
	prepareChannelIdsIfUserTypeIsStaff,
	prepareLog,
]);

exports.after = compose([
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.UPDATED_DESCRIPTION),
	createLog,
]);
