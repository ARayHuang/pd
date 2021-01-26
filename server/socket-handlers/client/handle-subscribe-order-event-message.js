const { ENUM_SOCKET_EVENT } = require('../../lib/enum');
const {
	getTopicByOrderId,
} = require('../../lib/socket');

module.exports = (socket, data, next) => {
	const { id, orderId } = data;

	socket.subscribeTopic(getTopicByOrderId(orderId), (event, data) => {
		socket.emit(event, data);
	});

	socket.emit(ENUM_SOCKET_EVENT.RESPONSE, {
		event: ENUM_SOCKET_EVENT.SUBSCRIBE_ORDER,
		id,
		status: 200,
	});
	next();
};
