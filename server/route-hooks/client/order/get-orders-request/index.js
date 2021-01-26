const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const { prepareChannelIdsIfUserTypeIsStaff } = require('../../../common');
const {
	setDefaultFrom,
	setDefaultLimit,
	setDefaultPage,
	setDefaultSort,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	prepareChannelIdsIfUserTypeIsStaff,
	setDefaultPage(),
	setDefaultLimit(),
	setDefaultSort('createdAt', 'desc'),
	setDefaultFrom(31),
]);
