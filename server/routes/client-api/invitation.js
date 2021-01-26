const express = require('express');
const router = new express.Router();
const {
	beforeAcceptInvitationRequest,
	afterAcceptInvitationRequest,
} = require('../../route-hooks/client/invitation');
const {
	handleAcceptInvitationRequest,
} = require('../../route-handlers/client/invitation');

router.post(
	'/id=:invitationId/accepted',
	beforeAcceptInvitationRequest,
	handleAcceptInvitationRequest,
	afterAcceptInvitationRequest,
);

module.exports = router;
