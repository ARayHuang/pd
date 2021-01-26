import {
	authActions,
	tagActions,
	orderActions,
	notifyActions,
	orderSocketActions,
} from '../controller';

const { updateMeChannelsAction } = authActions;
const { updateTagsAction } = tagActions;
const {
	appendOrderFileAction,
	appendOrderCommentAction,
	updateHasNewActivityAction,
	updateHadReadOrderAction,
	setAcceptedInvitationAction,
} = orderActions;
const { notifyErrorAction } = notifyActions;
const {
	socketOrderCreatedAction,
	socketOrderUpdatedAction,
	appendInvitationAction,
} = orderSocketActions;

/* eslint-disable */
function createSocketListener(socket, { dispatch, getState }) {
/* eslint-enable */

	// Add listener here
	// socket.on('XXX', data => {
	// 	dispatch(setYYYAction());
	// });

	socket.on('CHANNELS.UPDATED', channels => {
		dispatch(updateMeChannelsAction(channels));
	});

	socket.on('TAGS.UPDATED', data => {
		dispatch(updateTagsAction(data));
	});

	socket.on('RESPONSE', data => {
		const { event, error } = data;

		if (event === 'ORDER.SUBSCRIBE' && error) {
			dispatch(notifyErrorAction(error, error.message ? error.message : '请稍后再试'));
		}
	});

	socket.on('ORDER.FILE.CREATED', orderFile => {
		dispatch(appendOrderFileAction(orderFile));
	});

	socket.on('ORDER.HAS-NEW-ACTIVITY.UPDATED', order => {
		const { order: reducerOrder } = getState();
		const selectedOrderId = reducerOrder.get('selectedOrderId');
		const { id, channel: { id: channelId } } = order;

		if (id && selectedOrderId && id === selectedOrderId) {
			dispatch(updateHadReadOrderAction(channelId, selectedOrderId));
		} else {
			dispatch(updateHasNewActivityAction(order));
		}
	});

	socket.on('ORDER.COMMENT.CREATED', orderComment => {
		dispatch(appendOrderCommentAction(orderComment));
	});

	socket.on('ORDER.CREATED', data => {
		const { status } = data;

		if (status === 422) {
			const { error } = data;

			dispatch(notifyErrorAction(error, error.message));
		}

		dispatch(socketOrderCreatedAction(data));
	});

	socket.on('ORDER.UPDATED', data => {
		const { status } = data;

		if (status === 422) {
			const { error } = data;

			dispatch(notifyErrorAction(error, error.message));
		}

		dispatch(socketOrderUpdatedAction(data));
	});

	socket.on('INVITATION.CREATED', invitationCreated => {
		dispatch(appendInvitationAction(invitationCreated));
	});

	socket.on('INVITATION.UPDATED', invitationUpdated => {
		const { order } = invitationUpdated;
		const { auth } = getState();
		const { id: meId } = auth.get('me').toObject();
		const { type, order: nextOrder = {}, invitee = {} } = invitationUpdated;

		dispatch(socketOrderUpdatedAction(order));

		if (invitee.id === meId) {
			dispatch(setAcceptedInvitationAction(type, nextOrder.id));
		}

		/* eslint-disable */
		// const { auth, consumerOrders } = getState();
		// const departmentType = auth.get('departmentType');
		// const { id: meId } = auth.get('me').toObject();
		// const { handlerId } = consumerOrders.get('processingSearchQueries').toObject();
		// const orders = consumerOrders.getIn(['data', 'orders']).toArray();
		// const { type, order: nextOrder = {}, inviter = {}, invitee = {} } = invitationUpdated;
		// const orderIndex = orders.findIndex(order => order.id === nextOrder.id);
		// const isProvider = departmentType === PROVIDER;
		// const isConsumer = departmentType === CONSUMER;
		// const isCoHandler = type === CO_HANDLER;
		// const isTransferredHandler = type === TRANSFERRED_HANDLER;
		// const isInviter = inviter.id === meId;
		// const isInvitee = invitee.id === meId;
		// const isOrderExist = orderIndex > -1;
		// const isConsumerWithoutHandlerId = isConsumer && !handlerId;
		// const isCoHandlerInviterWithHandlerId = isConsumer && handlerId && isCoHandler && isInviter;
		// const isCoHandlerInviteeWithHandlerId = isConsumer && handlerId && isCoHandler && isInvitee;
		// const isTransferHandlerInviterWithHandlerId = isConsumer && handlerId && isTransferredHandler && isInviter;
		// const isTransferHandlerInviteeWithHandlerId = isConsumer && handlerId && isTransferredHandler && isInvitee && !isOrderExist;
		// const isTransferHandlerInviteeWithHandlerIdAcceptedCoHandle = isConsumer && handlerId && isTransferredHandler && isInvitee && isOrderExist;

		// if (
		// 	isProvider ||
		// 	isConsumerWithoutHandlerId ||
		// 	isCoHandlerInviterWithHandlerId ||
		// 	isTransferHandlerInviteeWithHandlerIdAcceptedCoHandle
		// ) {
		// 	dispatch(updateOrderFromInvitationUpdatedAction(invitationUpdated));
		// }

		// if (
		// 	isCoHandlerInviteeWithHandlerId ||
		// 	isTransferHandlerInviteeWithHandlerId
		// ) {
		// 	dispatch(addOrderFromInvitationUpdatedAction(nextOrder));
		// }

		// if (isTransferHandlerInviterWithHandlerId) {
		// 	dispatch(removeOrderFromInvitationUpdatedAction(nextOrder.id));
		// }
		/* eslint-enable */
	});
}

export default createSocketListener;
