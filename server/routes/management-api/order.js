const express = require('express');
const router = new express.Router();
const {
	beforeGetOrderRequest,
	beforeGetOrdersRequest,
	beforeGetOrderLogsRequest,
	beforeGetOrderCommentsRequest,
} = require('../../route-hooks/management/order');
const {
	handleGetOrderRequest,
	handleGetOrdersRequest,
	handleGetOrderLogsRequest,
	handleGetOrderCommentsRequest,
} = require('../../route-handlers/management/order');

router.get(
	'/',
	beforeGetOrdersRequest,
	handleGetOrdersRequest,
);

router.get(
	'/id=:orderId/logs',
	beforeGetOrderLogsRequest,
	handleGetOrderLogsRequest,
);

router.get(
	'/id=:orderId',
	beforeGetOrderRequest,
	handleGetOrderRequest,
);

router.get(
	'/id=:orderId/comments',
	beforeGetOrderCommentsRequest,
	handleGetOrderCommentsRequest,
);

module.exports = router;
