const LogStore = require('../stores/log');

async function getLogsByOrderIdAndPagination(orderId, page, {
	limit,
	order,
	sort,
	projections,
} = {}) {
	const data = await LogStore.getLogsByOrderIdAndPagination(orderId, page, {
		limit,
		order,
		sort,
		projections,
	});
	const numOfItems = await LogStore.countLogsByOrderId(orderId);

	return {
		data,
		numOfItems,
		numOfPages: Math.ceil(numOfItems / limit),
	};
}

module.exports = {
	createLog: LogStore.createLog,
	getLogsByOrderIdAndPagination,

	LOG_PROJECTIONS: {
		LOG: LogStore.GET_LOG_PROJECTIONS,
	},
};
