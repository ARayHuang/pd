module.exports = {
	beforeGetOrderRequest: require('./get-order-request').before,
	beforeGetOrdersRequest: require('./get-orders-request').before,
	beforeGetOrderLogsRequest: require('./get-order-logs-request').before,
	beforeGetOrderCommentsRequest: require('./get-order-comments-request').before,
};
