class AjaxError extends Error {
	constructor(message) {
		super();
		this.name = 'AjaxError';
		this.message = message;
	}
}

class GeneralError extends Error {
	constructor(message) {
		super();
		this.name = 'AjaxError';
		this.message = message;
	}
}

module.exports = {
	AjaxError,
	GeneralError,
};
