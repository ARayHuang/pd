const logger = require('../server/lib/logger');
const { start, stop } = require('../server/cronjob');

/*
  The pm2 gracefulReload flow:
  0s: start the new process
  2s: pm2 send the `shutdown` message to the old process
  10s: the old process be killed
 */

setTimeout(() => {
	start();
	logger.info('start cronjob');
}, 10000);

process.on('message', message => {
	if (message === 'shutdown') {
		stop();
	}
});
