const cron = require('cron');
const logger = require('./lib/logger');
const {
	ENUM_TASK_NAME,
} = require('./lib/enum');
const {
	getTaskQueue,
} = require('./lib/task');
const jobs = [];

jobs.push(new cron.CronJob({
	cronTime: '0 0 0 * * *',
	onTick: () => {
		logger.info(`trigger ${ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS}`);
		getTaskQueue(ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS)
			.add()
			.catch(logger.error);
	},
}));

function start() {
	jobs.forEach(job => job.start());
}

function stop() {
	jobs.forEach(job => job.stop());
}

module.exports = {
	start,
	stop,
};
