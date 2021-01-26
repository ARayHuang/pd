const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	validateUserDepartmentType,
	createLog,
} = require('../../../common');
const {
	ENUM_USER_DEPARTMENT,
	ENUM_ORDER_OPERATION_TYPE,
} = require('../../../../lib/enum');
const { validateUserChannelIfTypeIsStaff } = require('../../../channel.common');
const { createOrderOperationRecord } = require('../../../order.common');

exports.before = compose([
	validateRequestPayload,
	validateUserDepartmentType(ENUM_USER_DEPARTMENT.CONSUMER),
	validateUserChannelIfTypeIsStaff,
]);

exports.after = compose([
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.SUBSCRIBED_ORDER),
	createLog,
]);
