module.exports = {
	beforeSubscribeOrderEventMessage: require('./subscribe-order-event-message').before,
	beforeUnsubscribeOrderEventMessage: require('./unsubscribe-order-event-message').before,
};
