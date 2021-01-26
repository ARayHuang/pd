const logger = require('./lib/logger');
const cleanExpiredOrders = require('./tasks/clean-expired-orders');
const {
	ENUM_TASK_NAME,
} = require('./lib/enum');
const {
	getTaskQueue,
} = require('./lib/task');

function start() {
	try {
		getTaskQueue(ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS).process(1, cleanExpiredOrders);
	} catch (error) {
		logger.error(error);
		throw error;
	}
}

function stop() {
	getTaskQueue(ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS).close();
}

module.exports = {
	start,
	stop,
};
