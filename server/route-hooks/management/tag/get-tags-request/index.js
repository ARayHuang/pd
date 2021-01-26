const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const prepareStatus = require('./prepare-status');
const { setDefaultSort } = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	prepareStatus,
	setDefaultSort('createdAt', 'asc'),
]);
