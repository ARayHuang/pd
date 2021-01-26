import {
	START_FETCH_CREATED_ORDERS,
	FETCH_CREATED_ORDERS_SUCCESS,
	FETCH_CREATED_ORDERS_FAILED,
	START_FETCH_NEXT_CREATED_ORDERS,
	FETCH_NEXT_CREATED_ORDERS_SUCCESS,
	FETCH_NEXT_CREATED_ORDERS_FAILED,
	SET_CREATED_ORDERS_NUM_OF_ITEMS,
} from './action-types';

export function fetchCreatedOrdersAction() {
	return {
		type: START_FETCH_CREATED_ORDERS,
	};
}

export function fetchCreatedOrdersSuccessAction(createdOrders = {}) {
	return {
		type: FETCH_CREATED_ORDERS_SUCCESS,
		createdOrders,
	};
}

export function fetchCreatedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CREATED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function fetchNextCreatedOrdersAction(page) {
	return {
		type: START_FETCH_NEXT_CREATED_ORDERS,
		page,
	};
}

export function fetchNextCreatedOrdersSuccessAction(page, createdOrders = {}) {
	return {
		type: FETCH_NEXT_CREATED_ORDERS_SUCCESS,
		page,
		createdOrders,
	};
}

export function fetchNextCreatedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_NEXT_CREATED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function setCreatedOrdersNumOfItemsAction(numOfItems = 0) {
	return {
		type: SET_CREATED_ORDERS_NUM_OF_ITEMS,
		numOfItems,
	};
}
