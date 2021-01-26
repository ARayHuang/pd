const Queue = require('bull');
const config = require('config');
const queues = {};
const jobCompletedHandlerPool = {};
const jobFailedHandlerPool = {};

/**
 * @param {string} name - The task queue name.
 * @returns {Queue}
 */
function getTaskQueue(name) {
	if (name in queues) {
		return queues[name];
	}

	const queue = new Queue(name, config.SERVER.REDIS_URL.TASK_QUEUE);

	queues[name] = queue;
	queue.on('global:completed', (jobId, result) => {
		const handler = jobCompletedHandlerPool[`${name}-${jobId}`];

		if (handler) {
			delete jobCompletedHandlerPool[`${name}-${jobId}`];
			delete jobCompletedHandlerPool[`${name}-${jobId}`];
			handler(jobId, result);
		}
	});
	queue.on('global:failed', (jobId, error) => {
		const handler = jobFailedHandlerPool[`${name}-${jobId}`];

		if (handler) {
			delete jobFailedHandlerPool[`${name}-${jobId}`];
			delete jobFailedHandlerPool[`${name}-${jobId}`];
			handler(jobId, error);
		}
	});

	return queue;
}

/**
 * The promise based add job method.
 * @param {string} name - The task name.
 * @param {Object} data - The task parameter.
 * @param {Object} options - The job options. https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
 * @returns {Promise<string>} - It maybe json string.
 */
function executeTaskQueueJob(name, data, options) {
	return new Promise((resolve, reject) => {
		getTaskQueue(name)
			.add(data, options)
			.then(job => {
				// Add job success.
				onTaskJobCompleted(name, job.id, (jobId, result) => {
					resolve(result);
				});
				onTaskJobFailed(name, job.id, (jobId, error) => {
					reject(new Error(error));
				});
			})
			.catch(error => {
				// Add job failed.
				reject(error);
			});
	});
}

/**
 * Register an event handler for job completed.
 * @param {string} taskName - The task name.
 * @param {number} jobId - The job id.
 * @param {function(jobId: string, result)} func
 * @returns {undefined}
 */
function onTaskJobCompleted(taskName, jobId, func) {
	jobCompletedHandlerPool[`${taskName}-${jobId}`] = func;
}

/**
 * Register an event handler for job failed.
 * @param {string} taskName - The task name.
 * @param {number} jobId - The job id.
 * @param {function(jobId: string, error)} func
 * @returns {undefined}
 */
function onTaskJobFailed(taskName, jobId, func) {
	jobFailedHandlerPool[`${taskName}-${jobId}`] = func;
}

module.exports = {
	getTaskQueue,
	executeTaskQueueJob,
};
