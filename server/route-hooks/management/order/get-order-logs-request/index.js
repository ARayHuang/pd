const compose = require('compose-middleware').compose;
const validateRequestPayload = require('./validate-request-payload');
const isOrderExisted = require('./is-order-existed');
const {
	setDefaultLimit,
	setDefaultPage,
	setDefaultSort,
} = require('../../../common');

exports.before = compose([
	validateRequestPayload,
	isOrderExisted,
	setDefaultLimit(),
	setDefaultPage(),
	setDefaultSort('createdAt', 'desc'),
]);
