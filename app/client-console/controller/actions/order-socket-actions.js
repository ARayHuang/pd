import {
	ON_ORDER_CREATED,
	ON_ORDER_UPDATED,
	SOCKET_INSERT_ONE_OF_ORDERS,
	SOCKET_APPEND_CREATED_ORDER,

	APPEND_INVITATION,
	REMOVE_INVITATION,
	UPDATE_ORDER_FROM_INVITATION_UPDATED,
	ADD_ORDER_FROM_INVITATION_UPDATED,
	REMOVE_ORDER_FROM_INVITATION_UPDATED,
} from './action-types';

export function socketOrderCreatedAction(order) {
	return {
		type: ON_ORDER_CREATED,
		order,
	};
}

export function socketOrderUpdatedAction(order) {
	return {
		type: ON_ORDER_UPDATED,
		order,
	};
}

export function socketInsertOneOfOrdersAction(order) {
	return {
		type: SOCKET_INSERT_ONE_OF_ORDERS,
		order,
	};
}

export function socketAppendCreatedOrderAction(order) {
	return {
		type: SOCKET_APPEND_CREATED_ORDER,
		order,
	};
}

export function appendInvitationAction(createdInvitation) {
	return {
		type: APPEND_INVITATION,
		createdInvitation,
	};
}

export function removeInvitationAction(invitationId) {
	return {
		type: REMOVE_INVITATION,
		invitationId,
	};
}

export function updateOrderFromInvitationUpdatedAction(nextOrder) {
	return {
		type: UPDATE_ORDER_FROM_INVITATION_UPDATED,
		nextOrder,
	};
}

export function addOrderFromInvitationUpdatedAction(order) {
	return {
		type: ADD_ORDER_FROM_INVITATION_UPDATED,
		order,
	};
}

export function removeOrderFromInvitationUpdatedAction(orderId) {
	return {
		type: REMOVE_ORDER_FROM_INVITATION_UPDATED,
		orderId,
	};
}
