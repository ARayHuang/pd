const compose = require('compose-middleware').compose;
const { ENUM_SOCKET_EVENT } = require('../lib/enum');
const {
	beforeSubscribeOrderEventMessage,
	beforeUnsubscribeOrderEventMessage,
} = require('../socket-hooks/client');
const {
	handleSubscribeOrderEventMessage,
	handleUnsubscribeOrderEventMessage,
} = require('../socket-handlers/client');

module.exports = {
	[ENUM_SOCKET_EVENT.SUBSCRIBE_ORDER]: compose([
		beforeSubscribeOrderEventMessage,
		handleSubscribeOrderEventMessage,
	]),
	[ENUM_SOCKET_EVENT.UNSUBSCRIBE_ORDER]: compose([
		beforeUnsubscribeOrderEventMessage,
		handleUnsubscribeOrderEventMessage,
	]),
};
