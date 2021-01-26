const os = require('os');
const util = require('util');
const config = require('config');
const ljitError = require('ljit-error');
const logger = require('ljit-logger')(config.SERVER.LOG_LEVEL);

ljitError.initialize();

function dispatch(method, data) {
	let logInformation;

	if (typeof data === 'string') {
		logInformation = { message: data };
	} else {
		logInformation = data;
	}

	logger[method]({
		hostname: os.hostname(),
		...logInformation,
	});
}

function debug(args) {
	dispatch('debug', args);
}

function info(args) {
	dispatch('info', args);
}

function warn(args) {
	dispatch('warn', args);
}

function error(error, extra) {
	if (typeof error.formatStack === 'function') {
		dispatch('error', {
			message: error.message,
			error: error.formatStack(),
			...extra,
		});
	} else if (typeof error === 'string') {
		dispatch('error', {
			message: error,
			...extra,
		});
	} else {
		dispatch('error', {
			message: util.inspect(error),
			...extra,
		});
	}
}

module.exports = {
	debug,
	info,
	warn,
	error,
};
