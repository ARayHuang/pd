const config = require('config');
const { connect } = require('ljit-db/mongoose');
const logger = require('../server/lib/logger');
const { start, stop } = require('../server/task-worker');

/*
  The pm2 gracefulReload flow:
  0s: start the new process
  2s: pm2 send the `shutdown` message to the old process
  10s: the old process be killed
 */

setTimeout(async () => {
	try {
		await connect(config.SERVER.MONGO.URL);
		start();
		logger.info('start task-worker');
	} catch (error) {
		logger.error(error);
		throw error;
	}
}, 10000);

process.on('message', message => {
	if (message === 'shutdown') {
		stop();
	}
});
