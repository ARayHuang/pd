const config = require('config');
const { connect } = require('ljit-db/mongoose');
const optimist = require('optimist');
const logger = require('./server/lib/logger');
const {
	ENUM_TASK_NAME,
} = require('./server/lib/enum');
const {
	executeTaskQueueJob,
} = require('./server/lib/task');
const op = optimist
	.usage(
		`
Usage:
  Initial fixtures (drop collections then create):
  node . init

  Sync indexes:
  node . sync

  Add task job:
  node . task ${ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS}`,
	);
const { argv } = op;

async function initFixtures() {
	try {
		const { initialCollections } = require('./server/fixtures');

		await connect(config.SERVER.MONGO.URL, { debug: false });
		await initialCollections();
		logger.info('[mongo] init fixtures done');
	} catch (error) {
		throw error;
	}
}

async function sync() {
	try {
		const { syncIndexes } = require('./server/fixtures');

		await connect(config.SERVER.MONGO.URL);
		await syncIndexes();
	} catch (error) {
		throw error;
	}
}

async function runTask(taskName) {
	try {
		if (taskName === ENUM_TASK_NAME.CLEAN_EXPIRED_ORDERS) {
			const result = await executeTaskQueueJob(taskName);

			logger.info(`Deleted orders:\n${result}`);
			return;
		}

		throw new Error(`task ${taskName} not found`);
	} catch (error) {
		throw error;
	}
}

/**
 * @returns {Promise<*>}
 */
function execute() {
	if (argv._[0] === 'init') {
		return initFixtures();
	}

	if (argv._[0] === 'sync') {
		return sync();
	}

	if (argv._[0] === 'task') {
		return runTask(argv._[1]);
	}

	return Promise.resolve(op.showHelp());
}

execute()
	.then(() => process.exit(0))
	.catch(error => {
		logger.error(error);
		process.exit(1);
	});
