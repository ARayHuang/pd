const compose = require('compose-middleware').compose;
const validateRequestPayload = require('../common').createInvitationValidateRequestPayload;
const { ORDER_PROJECTIONS } = require('../../../../services/order');
const { USER_PROJECTIONS } = require('../../../../services/user');
const {
	isUserIdEqualOwnerId,
} = require('../../../order.common');
const {
	prepareOrderAndChannel,
	validateInviteeDepartmentType,
	prepareUser,
} = require('../common');
const {
	ENUM_INVITATION_TYPE,
	ENUM_USER_DEPARTMENT,
} = require('../../../../lib/enum');

exports.before = compose([
	validateRequestPayload(ENUM_INVITATION_TYPE.TRANSFERRED_OWNER),
	prepareOrderAndChannel(ORDER_PROJECTIONS.ORDER),
	isUserIdEqualOwnerId,
	prepareUser(USER_PROJECTIONS.DEPARTMENT_TYPE_AND_DISPLAY_NAME),
	validateInviteeDepartmentType(ENUM_USER_DEPARTMENT.PROVIDER),
]);
