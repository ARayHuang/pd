const compose = require('compose-middleware').compose;
const validateEventData = require('./validate-event-data');
const prepareChannelId = require('./prepare-channel-id');
const { ORDER_PROJECTIONS } = require('../../../services/order');
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
