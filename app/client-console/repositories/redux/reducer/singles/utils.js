export function updateOrderHasNewActivityStatus(order = {}, newOrder = {}) {
	if (order.id === newOrder.id) {
		return {
			...order,
			hasNewActivity: newOrder.hasNewActivity,
		};
	}

	return order;
}
