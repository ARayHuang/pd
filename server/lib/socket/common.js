/**
 * Generate the topic by order id.
 * @param {string|ObjectId} orderId
 * @returns {string}
 */
function getTopicByOrderId(orderId) {
	return `/orders/id=${orderId}`;
}

module.exports = {
	getTopicByOrderId,
};
