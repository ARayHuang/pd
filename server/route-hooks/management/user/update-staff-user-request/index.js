const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	validateUserType,
	prepareManagedUser,
	hasPermissionToManageUser,
} = require('../../user.common');
const prepareChannelsIfUpdateChannelIds = require('./prepare-channels-if-update-channel-ids');
const isChannelIdsExistedIfUpdateChannelIds = require('./is-channel-ids-existed-if-update-channel-ids');
const { ENUM_USER_TYPE } = require('../../../../lib/enum');

exports.before = compose([
	validateRequestPayload,
	validateUserType([ENUM_USER_TYPE.ADMIN, ENUM_USER_TYPE.MANAGER]),
	prepareManagedUser,
	hasPermissionToManageUser,
	prepareChannelsIfUpdateChannelIds,
	isChannelIdsExistedIfUpdateChannelIds,
]);
