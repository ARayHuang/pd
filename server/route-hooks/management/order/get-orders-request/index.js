const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const {
	setDefaultLimit,
	setDefaultPage,
	setDefaultSort,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	setDefaultLimit(),
	setDefaultPage(),
	setDefaultSort('createdAt', 'desc'),
]);
