const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const prepareTags = require('./prepare-tags');
const {
	validateUserChannelIfTypeIsStaff,
	isChannelExisted,
} = require('../../../channel.common');
const {
	createOrderOperationRecord,
} = require('../../../order.common');
const {
	validateUserDepartmentType,
	createLog,
} = require('../../../common');
const {
	ENUM_USER_DEPARTMENT,
	ENUM_ORDER_OPERATION_TYPE,
} = require('../../../../lib/enum');

exports.before = compose([
	validateRequestPayload,
	validateUserDepartmentType(ENUM_USER_DEPARTMENT.PROVIDER),
	validateUserChannelIfTypeIsStaff,
	isChannelExisted,
	prepareTags,
]);

exports.after = compose([
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.SUBSCRIBED_ORDER),
	createLog,
]);
