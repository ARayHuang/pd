module.exports = (socket, data, next) => {
	data.channelId = data.order.channelId;

	next();
};
