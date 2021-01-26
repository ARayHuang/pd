const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const prepareChannelIdIfQueriedTypeIsStaff = require('./prepare-channel-id-if-queried-type-is-staff');
const prepareChannelNameIfQueriedTypeIsStaff = require('./prepare-channel-name-if-queried-type-is-staff');
const prepareHasPermissionToAddStaffIfTypeIsManager = require('./prepare-has-permission-to-add-staff-if-type-is-manager');
const {
	setDefaultPage,
	setDefaultLimit,
	setDefaultSort,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	prepareChannelIdIfQueriedTypeIsStaff,
	prepareChannelNameIfQueriedTypeIsStaff,
	prepareHasPermissionToAddStaffIfTypeIsManager,
	setDefaultPage(),
	setDefaultLimit(),
	setDefaultSort('createdAt', 'desc'),
]);
