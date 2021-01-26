const express = require('express');
const router = new express.Router();
const {
	beforeCreateOrderFileRequest,
	beforeCreateOrderRequest,
	beforeGetOrdersRequest,
	beforeCreateOrderCommentRequest,
	beforeDeleteOrderRequest,
	beforeCompleteOrderRequest,
	beforeAcceptOrderRequest,
	beforeTrackOrderRequest,
	beforeResolveOrderRequest,
	beforeGetOrderCommentsRequest,
	beforeDeleteOrderFileRequest,
	beforeReadOrderRequest,
	afterCompleteOrderRequest,
	afterCreateOrderRequest,
	afterCreateOrderCommentRequest,
	afterDeleteOrderRequest,
	afterCreateOrderFileRequest,
	afterAcceptOrderRequest,
	afterTrackOrderRequest,
	afterResolveOrderRequest,
} = require('../../route-hooks/client/channel');
const {
	handleCreateOrderFileRequest,
	handleCreateOrderRequest,
	handleGetOrdersRequest,
	handleDeleteOrderRequest,
	handleCompleteOrderRequest,
	handleAcceptOrderRequest,
	handleCreateOrderCommentRequest,
	handleTrackOrderRequest,
	handleResolveOrderRequest,
	handleGetOrderCommentsRequest,
	handleDeleteOrderFileRequest,
	handleReadOrderRequest,
} = require('../../route-handlers/client/channel');

router.post(
	'/id=:channelId/orders/id=:orderId/files',
	beforeCreateOrderFileRequest,
	handleCreateOrderFileRequest,
	afterCreateOrderFileRequest,
);

router.post(
	'/id=:channelId/orders',
	beforeCreateOrderRequest,
	handleCreateOrderRequest,
	afterCreateOrderRequest,
);

router.get(
	'/id=:channelId/orders',
	beforeGetOrdersRequest,
	handleGetOrdersRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/accepted',
	beforeAcceptOrderRequest,
	handleAcceptOrderRequest,
	afterAcceptOrderRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/resolved',
	beforeResolveOrderRequest,
	handleResolveOrderRequest,
	afterResolveOrderRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/tracked',
	beforeTrackOrderRequest,
	handleTrackOrderRequest,
	afterTrackOrderRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/completed',
	beforeCompleteOrderRequest,
	handleCompleteOrderRequest,
	afterCompleteOrderRequest,
);

router.delete(
	'/id=:channelId/orders/id=:orderId',
	beforeDeleteOrderRequest,
	handleDeleteOrderRequest,
	afterDeleteOrderRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/read',
	beforeReadOrderRequest,
	handleReadOrderRequest,
);

router.post(
	'/id=:channelId/orders/id=:orderId/comments',
	beforeCreateOrderCommentRequest,
	handleCreateOrderCommentRequest,
	afterCreateOrderCommentRequest,
);

router.get(
	'/id=:channelId/orders/id=:orderId/comments',
	beforeGetOrderCommentsRequest,
	handleGetOrderCommentsRequest,
);

router.delete(
	'/id=:channelId/orders/id=:orderId/files/id=:fileId',
	beforeDeleteOrderFileRequest,
	handleDeleteOrderFileRequest,
);

module.exports = router;
