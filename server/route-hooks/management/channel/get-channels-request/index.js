const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	setDefaultPage,
	setDefaultLimit,
	setDefaultSort,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	setDefaultPage(),
	setDefaultLimit(),
	setDefaultSort('createdAt', 'desc'),
]);
