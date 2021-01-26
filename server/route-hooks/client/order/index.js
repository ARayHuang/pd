module.exports = {
	beforeGetOrdersRequest: require('./get-orders-request').before,
	beforeGetOrderRequest: require('./get-order-request').before,
	beforeCreateInvitationTypeCoOwnerRequest: require('./create-invitation-type-co-owner-request').before,
	beforeCreateInvitationTypeCoHandlerRequest: require('./create-invitation-type-co-handler-request').before,
	beforeCreateInvitationTypeTransferredOwnerRequest: require('./create-invitation-type-transferred-owner-request').before,
	beforeCreateInvitationTypeTransferredHandlerRequest: require('./create-invitation-type-transferred-handler-request').before,
	beforeUpdateDescriptionRequest: require('./update-description-request').before,
	afterUpdateDescriptionRequest: require('./update-description-request').after,
};
