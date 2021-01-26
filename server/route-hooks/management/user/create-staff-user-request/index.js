const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isChannelIdsExisted = require('./is-channel-ids-existed');
const { validateUserType } = require('../../user.common');
const { ENUM_USER_TYPE } = require('../../../../lib/enum');
const { hasPermissionToAddStaff } = require('../../user.common');

exports.before = compose([
	validateRequestPayload,
	hasPermissionToAddStaff,
	validateUserType([ENUM_USER_TYPE.MANAGER]),
	isChannelIdsExisted,
]);
