import {
	START_FETCH_ORDERS,
	FETCH_ORDERS_SUCCESS,
	FETCH_ORDERS_FAILED,
} from './action-types';

export function fetchOrdersAction(queries) {
	return {
		type: START_FETCH_ORDERS,
		queries,
	};
}

export function fetchOrdersSuccessAction(orders, numOfItems, numOfPages, page) {
	return {
		type: FETCH_ORDERS_SUCCESS,
		orders,
		numOfItems,
		numOfPages,
		page,
	};
}

export function fetchOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_ORDERS_FAILED,
		error,
		errorMessage,
	};
}
