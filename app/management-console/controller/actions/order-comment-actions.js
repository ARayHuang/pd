import {
	START_FETCH_ORDER,
	FETCH_ORDER_SUCCESS,
	FETCH_ORDER_FAILED,

	START_FETCH_ORDER_COMMENTS,
	FETCH_ORDER_COMMENTS_SUCCESS,
	FETCH_ORDER_COMMENTS_FAILED,
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

export function fetchOrderCommentsAction(orderId, queries) {
	return {
		type: START_FETCH_ORDER_COMMENTS,
		orderId,
		queries,
	};
}

export function fetchOrderCommentsSuccessAction(comments, numOfItems, numOfPages) {
	return {
		type: FETCH_ORDER_COMMENTS_SUCCESS,
		comments,
		numOfItems,
		numOfPages,
	};
}

export function fetchOrderCommentsFailedAction(error, errorMessage) {
	return {
		type: FETCH_ORDER_COMMENTS_FAILED,
		error,
		errorMessage,
	};
}
