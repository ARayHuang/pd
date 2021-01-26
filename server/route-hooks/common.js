const config = require('config');
const {
	AuthenticationError,
	ForbiddenError,
} = require('ljit-error');
const {
	WITHOUT_LOGGED_IN,
	USER_IS_FORBIDDEN,
} = require('../lib/error/code');
const {
	ENUM_USER_TYPE,
} = require('../lib/enum');
const { createLog } = require('../services/log');
const MS_OF_A_DAY = 24 * 60 * 60 * 1000;

/**
 * @returns {function(req, res, next)}
 */
function isLoggedIn() {
	return (req, res, next) => {
		if (!req.user) {
			return next(new AuthenticationError(WITHOUT_LOGGED_IN.MESSAGE, WITHOUT_LOGGED_IN.CODE));
		}

		next();
	};
}

/**
 * @param {Array<string>} allowAccessUserTypes
 * @returns {function(req, res, next)}
 */
function hasManagementPermission(allowAccessUserTypes = [
	ENUM_USER_TYPE.ADMIN,
	ENUM_USER_TYPE.MANAGER,
]) {
	return (req, res, next) => {
		if (allowAccessUserTypes.indexOf(req.user.type) < 0) {
			return next(new ForbiddenError(USER_IS_FORBIDDEN.MESSAGE, USER_IS_FORBIDDEN.CODE));
		}

		next();
	};
}

function setDefaultPage(defaultValue = config.SERVER.PAGINATION.PAGE) {
	return (req, res, next) => {
		req.query.page = req.query.page === undefined ?
			defaultValue :
			parseInt(req.query.page, 10);

		next();
	};
}

function setDefaultLimit(defaultValue = config.SERVER.PAGINATION.LIMIT) {
	return (req, res, next) => {
		req.query.limit = req.query.limit === undefined ?
			defaultValue :
			parseInt(req.query.limit, 10);

		next();
	};
}

function convertOrder(order) {
	if (order === 'asc') {
		return 1;
	}

	return -1;
}

function setDefaultSort(field, order) {
	return (req, res, next) => {
		req.query.sort = req.query.sort === undefined ?
			field :
			req.query.sort;
		req.query.order = req.query.order === undefined ?
			convertOrder(order) :
			convertOrder(req.query.order);

		next();
	};
}

function validateUserDepartmentType(validDepartmentTypes) {
	return function (req, res, next) {
		if (validDepartmentTypes === req.user.departmentType) {
			next();
		} else {
			next(new ForbiddenError(
				USER_IS_FORBIDDEN.MESSAGE,
				USER_IS_FORBIDDEN.CODE,
			));
		}
	};
}

function setDefaultFrom(days) {
	return (req, res, next) => {
		const { from } = req.query;
		const maxQueriedDateRangeInMS = days * MS_OF_A_DAY;
		const todayInTimestamp = new Date().getTime();
		const queriedDateInTimestamp = new Date(from).getTime();

		if (
			from === undefined ||
			(todayInTimestamp - queriedDateInTimestamp) > maxQueriedDateRangeInMS
		) {
			req.query.from = new Date(Date.now() - maxQueriedDateRangeInMS);
		}

		next();
	};
}

/**
 * @param {Object} req
 * @param {{locals: {log: {operator: ObjectId, type: string, orderId: ObjectId}}}} res
 * @param {function} next
 * @returns {Promise<*>}
 */
async function createLogMiddleware(req, res, next) {
	try {
		await createLog(res.locals.log);
	} catch (error) {
		return next(error);
	}

	next();
}

function prepareChannelIdsIfUserTypeIsStaff(req, res, next) {
	if (req.user.type !== ENUM_USER_TYPE.STAFF) {
		return next();
	}

	res.locals.channelIds = req.user.channels;

	next();
}

module.exports = {
	isLoggedIn,
	validateUserDepartmentType,
	hasManagementPermission,
	setDefaultPage,
	setDefaultLimit,
	setDefaultSort,
	setDefaultFrom,
	createLog: createLogMiddleware,
	prepareChannelIdsIfUserTypeIsStaff,
};
