const { ENUM_SOCKET_EVENT } = require('../../lib/enum');
const {
	getTopicByOrderId,
} = require('../../lib/socket');

module.exports = (socket, data, next) => {
	const { id, orderId } = data;

	socket.unsubscribeTopic(getTopicByOrderId(orderId));
	socket.emit(ENUM_SOCKET_EVENT.RESPONSE, {
		event: ENUM_SOCKET_EVENT.UNSUBSCRIBE_ORDER,
		id,
		status: 200,
	});
	next();
};
