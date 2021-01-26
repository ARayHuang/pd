const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isOrderExisted = require('./is-order-existed');
const { setDefaultSort } = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	isOrderExisted,
	setDefaultSort('createdAt', 'desc'),
]);
