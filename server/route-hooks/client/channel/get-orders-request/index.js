const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	isChannelExisted,
	validateUserChannelIfTypeIsStaff,
} = require('../../../channel.common');
const {
	setDefaultPage,
	setDefaultLimit,
	setDefaultSort,
	setDefaultFrom,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	validateUserChannelIfTypeIsStaff,
	isChannelExisted,
	setDefaultPage(),
	setDefaultLimit(),
	setDefaultSort('createdAt', 'desc'),
	setDefaultFrom(31),
]);
