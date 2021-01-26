import {
	START_FETCH_ORDER,
	FETCH_ORDER_SUCCESS,
	FETCH_ORDER_FAILED,
	SET_SELECTED_ORDER_ID,
	RESET_SELECTED_ORDER_ID,

	SET_SELECTED_TAB,

	START_FETCH_PROCESSING_ORDERS,
	FETCH_PROCESSING_ORDERS_SUCCESS,
	FETCH_PROCESSING_ORDERS_FAILED,

	START_FETCH_TRACKED_ORDERS,
	FETCH_TRACKED_ORDERS_SUCCESS,
	FETCH_TRACKED_ORDERS_FAILED,

	START_FETCH_CLOSED_ORDERS,
	FETCH_CLOSED_ORDERS_SUCCESS,
	FETCH_CLOSED_ORDERS_FAILED,

	RESET_ORDERS,

	START_CREATE_ORDER,
	CREATE_ORDER_SUCCESS,
	CREATE_ORDER_FAILED,

	START_FETCH_NEXT_PROCESSING_ORDERS,
	FETCH_NEXT_PROCESSING_ORDERS_SUCCESS,
	FETCH_NEXT_PROCESSING_ORDERS_FAILED,

	START_DELETE_ORDER,
	DELETE_ORDER_SUCCESS,
	DELETE_ORDER_FAILED,

	START_COMPLETE_ORDER,
	COMPLETE_ORDER_SUCCESS,
	COMPLETE_ORDER_FAILED,

	START_TRACK_ORDER,
	TRACK_ORDER_SUCCESS,
	TRACK_ORDER_FAILED,

	START_ACCEPT_ORDER,
	ACCEPT_ORDER_SUCCESS,
	ACCEPT_ORDER_FAILED,

	START_RESOLVE_ORDER,
	RESOLVE_ORDER_SUCCESS,
	RESOLVE_ORDER_FAILED,

	START_INVITE_ORDER,
	INVITE_ORDER_SUCCESS,
	INVITE_ORDER_FAILED,

	START_ACCEPT_INVITATION_ORDER,
	ACCEPT_INVITATION_SUCCESS_ORDER,
	ACCEPT_INVITATION_FAILED_ORDER,
	ADD_ACCEPTED_INVITATION_ORDER,
	REMOVE_ACCEPTED_INVITATION_ORDER,

	START_UPDATE_ORDER_NUMBER,
	UPDATE_ORDER_NUMBER_SUCCESS,
	UPDATE_ORDER_NUMBER_FAILED,

	APPEND_ORDER_FILE,
	UPDATE_HAS_NEW_ACTIVITY,
	APPEND_ORDER_COMMENT,

	SET_PROCESSING_SEARCH_QUERIES,
	SET_TRACKED_SEARCH_QUERIES,
	SET_CLOSED_SEARCH_QUERIES,

	START_UPDATE_HAD_READ_ORDER,
	UPDATE_HAD_READ_ORDER_SUCCESS,
	UPDATE_HAD_READ_ORDER_FAILED,
	SET_PROCESSING_NUM_OF_ITEMS,
	SET_TRACKED_NUM_OF_ITEMS,

	START_FETCH_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
	START_FETCH_TRACKED_ORDERS_NUMBER_OF_ITEMS,
} from './action-types';

export function fetchOrderAction(orderId) {
	return {
		type: START_FETCH_ORDER,
		orderId,
	};
}

export function fetchOrderSuccessAction(order) {
	return {
		type: FETCH_ORDER_SUCCESS,
		order,
	};
}

export function fetchOrderFailedAction(error, errorMessage) {
	return {
		type: FETCH_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function setSelectedTabAction(selectedTab) {
	return {
		type: SET_SELECTED_TAB,
		selectedTab,
	};
}

export function fetchProcessingOrdersAction(
	channelId,
	page,
	{
		owner,
		handler,
		description,
		customerName,
		tagId,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_PROCESSING_ORDERS,
		channelId,
		page,
		searchQueries: {
			owner,
			handler,
			description,
			customerName,
			tagId,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchProcessingOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_PROCESSING_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchProcessingOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_PROCESSING_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function fetchTrackedOrdersAction(
	channelId,
	page,
	{
		owner,
		handler,
		description,
		customerName,
		tagId,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_TRACKED_ORDERS,
		channelId,
		page,
		searchQueries: {
			owner,
			handler,
			description,
			customerName,
			tagId,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchTrackedOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_TRACKED_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchTrackedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_TRACKED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function setSelectedOrderIdAction(id) {
	return {
		type: SET_SELECTED_ORDER_ID,
		id,
	};
}

export function resetSelectedOrderIdAction() {
	return {
		type: RESET_SELECTED_ORDER_ID,
	};
}

export function fetchClosedOrdersAction(
	channelId,
	page,
	{
		owner,
		handler,
		description,
		customerName,
		tagId,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_CLOSED_ORDERS,
		channelId,
		page,
		searchQueries: {
			owner,
			handler,
			description,
			customerName,
			tagId,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchClosedOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_CLOSED_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchClosedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CLOSED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function createOrderAction(
	channelId,
	{
		tagId,
		customerName,
		description,
	} = {},
) {
	return {
		type: START_CREATE_ORDER,
		channelId,
		data: {
			tagId,
			customerName,
			description,
		},
	};
}

export function createOrderSuccessAction() {
	return {
		type: CREATE_ORDER_SUCCESS,
	};
}

export function createOrderFailedAction(error, errorMessage) {
	return {
		type: CREATE_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function resetOrdersAction() {
	return {
		type: RESET_ORDERS,
	};
}

export function fetchNextProcessingOrdersAction(
	channelId,
	page,
	{
		owner,
		handler,
		customerName,
		tagId,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_NEXT_PROCESSING_ORDERS,
		channelId,
		page,
		searchQueries: {
			owner,
			handler,
			customerName,
			tagId,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchNextProcessingOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_NEXT_PROCESSING_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchNextProcessingOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_NEXT_PROCESSING_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function deleteOrderAction(channelId, orderId) {
	return {
		type: START_DELETE_ORDER,
		channelId,
		orderId,
	};
}

export function deleteOrderSuccessAction() {
	return {
		type: DELETE_ORDER_SUCCESS,
	};
}

export function deleteOrderFailedAction(error, errorMessage) {
	return {
		type: DELETE_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function acceptOrderAction(channelId, orderId) {
	return {
		type: START_ACCEPT_ORDER,
		channelId,
		orderId,
	};
}

export function acceptOrderSuccessAction() {
	return {
		type: ACCEPT_ORDER_SUCCESS,
	};
}

export function acceptOrderFailedAction(error, errorMessage) {
	return {
		type: ACCEPT_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function trackOrderAction(channelId, orderId) {
	return {
		type: START_TRACK_ORDER,
		channelId,
		orderId,
	};
}

export function trackOrderSuccessAction() {
	return {
		type: TRACK_ORDER_SUCCESS,
	};
}

export function trackOrderFailedAction(error, errorMessage) {
	return {
		type: TRACK_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function resolveOrderAction(channelId, orderId) {
	return {
		type: START_RESOLVE_ORDER,
		channelId,
		orderId,
	};
}

export function resolveOrderSuccessAction() {
	return {
		type: RESOLVE_ORDER_SUCCESS,
	};
}

export function resolveOrderFailedAction(error, errorMessage) {
	return {
		type: RESOLVE_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function completeOrderAction(channelId, orderId) {
	return {
		type: START_COMPLETE_ORDER,
		channelId,
		orderId,
	};
}

export function completeOrderSuccessAction() {
	return {
		type: COMPLETE_ORDER_SUCCESS,
	};
}

export function completeOrderFailedAction(error, errorMessage) {
	return {
		type: COMPLETE_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function inviteOrderAction(orderId, userId, invitationType) {
	return {
		type: START_INVITE_ORDER,
		orderId,
		userId,
		invitationType,
	};
}

export function inviteOrderSuccessAction() {
	return {
		type: INVITE_ORDER_SUCCESS,
	};
}

export function inviteOrderFailedAction(error, errorMessage) {
	return {
		type: INVITE_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function acceptInvitationOrderAction(invitationId) {
	return {
		type: START_ACCEPT_INVITATION_ORDER,
		invitationId,
	};
}

export function acceptInvitationOrderSuccessAction() {
	return {
		type: ACCEPT_INVITATION_SUCCESS_ORDER,
	};
}

export function acceptInvitationOrderFailedAction(error, errorMessage) {
	return {
		type: ACCEPT_INVITATION_FAILED_ORDER,
		error,
		errorMessage,
	};
}

export function setAcceptedInvitationAction(invitationType, orderId) {
	return {
		type: ADD_ACCEPTED_INVITATION_ORDER,
		orderId,
		invitationType,
	};
}

export function removeAcceptedInvitationAction(invitationType, orderId) {
	return {
		type: REMOVE_ACCEPTED_INVITATION_ORDER,
		orderId,
		invitationType,
	};
}

export function updateOrderNumberAction(orderId, orderNumber) {
	return {
		type: START_UPDATE_ORDER_NUMBER,
		orderId,
		orderNumber,
	};
}

export function updateOrderNumberSuccessAction() {
	return {
		type: UPDATE_ORDER_NUMBER_SUCCESS,
	};
}

export function updateOrderNumberFailedAction() {
	return {
		type: UPDATE_ORDER_NUMBER_FAILED,
	};
}

export function setProcessingSearchQueriesAction(processingSearchQueries) {
	return {
		type: SET_PROCESSING_SEARCH_QUERIES,
		processingSearchQueries,
	};
}

export function setTrackedSearchQueriesAction(trackedSearchQueries) {
	return {
		type: SET_TRACKED_SEARCH_QUERIES,
		trackedSearchQueries,
	};
}

export function setClosedSearchQueriesAction(closedSearchQueries) {
	return {
		type: SET_CLOSED_SEARCH_QUERIES,
		closedSearchQueries,
	};
}

export function updateHadReadOrderAction(channelId, orderId) {
	return {
		type: START_UPDATE_HAD_READ_ORDER,
		channelId,
		orderId,
	};
}

export function updateHadReadOrderSuccessAction() {
	return {
		type: UPDATE_HAD_READ_ORDER_SUCCESS,
	};
}

export function updateHadReadOrderFailedAction(error, errorMessage) {
	return {
		type: UPDATE_HAD_READ_ORDER_FAILED,
		error,
		errorMessage,
	};
}

export function setProcessingNumOfItemsAction(numOfItems = 0) {
	return {
		type: SET_PROCESSING_NUM_OF_ITEMS,
		numOfItems,
	};
}

export function setTrackedNumOfItemsAction(numOfItems = 0) {
	return {
		type: SET_TRACKED_NUM_OF_ITEMS,
		numOfItems,
	};
}

export function appendOrderFileAction(orderFile) {
	return {
		type: APPEND_ORDER_FILE,
		orderFile,
	};
}

export function updateHasNewActivityAction(order) {
	return {
		type: UPDATE_HAS_NEW_ACTIVITY,
		order,
	};
}

export function appendOrderCommentAction(orderComment) {
	return {
		type: APPEND_ORDER_COMMENT,
		orderComment,
	};
}

// Number of items
export function fetchProcessingOrdersNumberOfItemsAction(channelId, {
	handlerId,
	customerName,
	serialNumber,
	from,
	to,
} = {}) {
	return {
		type: START_FETCH_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
		channelId,
		searchQueries: {
			handlerId,
			customerName,
			serialNumber,
			from,
			to,
		},
	};
}

export function fetchTrackedOrdersNumberOfItemsAction(channelId, {
	handlerId,
	customerName,
	serialNumber,
	from,
	to,
} = {}) {
	return {
		type: START_FETCH_TRACKED_ORDERS_NUMBER_OF_ITEMS,
		channelId,
		searchQueries: {
			handlerId,
			customerName,
			serialNumber,
			from,
			to,
		},
	};
}
