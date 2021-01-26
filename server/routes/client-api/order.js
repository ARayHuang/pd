const express = require('express');
const router = new express.Router();
const {
	beforeGetOrdersRequest,
	beforeGetOrderRequest,
	beforeCreateInvitationTypeCoOwnerRequest,
	beforeCreateInvitationTypeCoHandlerRequest,
	beforeCreateInvitationTypeTransferredOwnerRequest,
	beforeCreateInvitationTypeTransferredHandlerRequest,
	beforeUpdateDescriptionRequest,
	afterUpdateDescriptionRequest,
} = require('../../route-hooks/client/order');
const {
	handleGetOrdersRequest,
	handleGetOrderRequest,
	handleCreateInvitationRequest,
	handleUpdateDescriptionRequest,
} = require('../../route-handlers/client/order');

router.get(
	'/',
	beforeGetOrdersRequest,
	handleGetOrdersRequest,
);

router.get(
	'/id=:orderId',
	beforeGetOrderRequest,
	handleGetOrderRequest,
);

router.post(
	'/id=:orderId/invitations',
	beforeCreateInvitationTypeCoOwnerRequest,
	handleCreateInvitationRequest,
);

router.post(
	'/id=:orderId/invitations',
	beforeCreateInvitationTypeCoHandlerRequest,
	handleCreateInvitationRequest,
);

router.post(
	'/id=:orderId/invitations',
	beforeCreateInvitationTypeTransferredOwnerRequest,
	handleCreateInvitationRequest,
);

router.post(
	'/id=:orderId/invitations',
	beforeCreateInvitationTypeTransferredHandlerRequest,
	handleCreateInvitationRequest,
);

router.put(
	'/id=:orderId/description',
	beforeUpdateDescriptionRequest,
	handleUpdateDescriptionRequest,
	afterUpdateDescriptionRequest,
);

module.exports = router;
