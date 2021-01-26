const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const validateRequestFile = require('./validate-request-file');
const isOrderFileExceeded = require('./is-order-file-exceeded');
const prepareFile = require('./prepare-file');
const {
	ENUM_ORDER_OPERATION_TYPE,
} = require('../../../../lib/enum');
const {
	ORDER_PROJECTIONS,
} = require('../../../../services/order');
const {
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
} = require('../../../channel.common');
const {
	prepareOrder,
	createOrderOperationRecord,
	hasPermissionToUploadOrderFile,
} = require('../../../order.common');

exports.before = compose([
	validateRequestPayload,
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
	prepareOrder(ORDER_PROJECTIONS.OWNER_AND_HANDLER),
	hasPermissionToUploadOrderFile,
	prepareFile,
	validateRequestFile,
	isOrderFileExceeded,
]);

exports.after = compose([
	createOrderOperationRecord(ENUM_ORDER_OPERATION_TYPE.CREATED_FILE),
]);
