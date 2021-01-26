import {
	START_FETCH_ORDER_LOGS,
	FETCH_ORDER_LOGS_SUCCESS,
	FETCH_ORDER_LOGS_FAILED,
} from './action-types';

export function fetchOrderLogsAction(orderId, queries) {
	return {
		type: START_FETCH_ORDER_LOGS,
		orderId,
		queries,
	};
}

export function fetchOrderLogsSuccessAction(logs, numOfItems, numOfPages) {
	return {
		type: FETCH_ORDER_LOGS_SUCCESS,
		logs,
		numOfItems,
		numOfPages,
	};
}

export function fetchOrderLogsFailedAction(error, errorMessage) {
	return {
		type: FETCH_ORDER_LOGS_FAILED,
		error,
		errorMessage,
	};
}
