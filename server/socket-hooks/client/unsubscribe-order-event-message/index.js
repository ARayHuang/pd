const compose = require('compose-middleware').compose;
const validateEventData = require('./validate-event-data');
const { ORDER_PROJECTIONS } = require('../../../services/order');
const prepareChannelId = require('./prepare-channel-id');
const {
	prepareOrder,
	validateUserChannelIfTypeIsStaff,
} = require('../../common');

exports.before = compose([
	validateEventData,
	prepareOrder(ORDER_PROJECTIONS.OWNER_HANDLER_AND_CHANNEL),
	prepareChannelId,
	validateUserChannelIfTypeIsStaff,
]);
