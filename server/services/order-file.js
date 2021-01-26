const OrderFileStore = require('../stores/order-file');

module.exports = {
	createOrderFile: OrderFileStore.createOrderFile,
	getOrderFilesByOrderId: OrderFileStore.getOrderFilesByOrderId,
	countOrderFilesByOrderId: OrderFileStore.countOrderFilesByOrderId,
	getOrderFileByIdAndOrderId: OrderFileStore.getOrderFileByIdAndOrderId,
	deleteOrderFileById: OrderFileStore.deleteOrderFileById,

	ORDER_FILE_PROJECTIONS: {
		ORDER_FILE: OrderFileStore.GET_ORDER_FILE_REQUEST_PROJECTIONS,
		MIN: OrderFileStore.MIN_PROJECTIONS,
	},
};
