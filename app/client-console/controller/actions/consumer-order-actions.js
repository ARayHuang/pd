import {
	SET_CONSUMER_SELECTED_TAB,
	SET_CONSUMER_PROCESSING_SEARCH_QUERIES,
	SET_CONSUMER_TRACKED_SEARCH_QUERIES,
	SET_CONSUMER_CLOSED_SEARCH_QUERIES,
	START_FETCH_CONSUMER_PROCESSING_ORDERS,
	FETCH_CONSUMER_PROCESSING_ORDERS_SUCCESS,
	FETCH_CONSUMER_PROCESSING_ORDERS_FAILED,
	START_FETCH_CONSUMER_TRACKED_ORDERS,
	FETCH_CONSUMER_TRACKED_ORDERS_SUCCESS,
	FETCH_CONSUMER_TRACKED_ORDERS_FAILED,
	START_FETCH_CONSUMER_CLOSED_ORDERS,
	FETCH_CONSUMER_CLOSED_ORDERS_SUCCESS,
	FETCH_CONSUMER_CLOSED_ORDERS_FAILED,
	START_FETCH_CONSUMER_NEXT_PROCESSING_ORDERS,
	FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_SUCCESS,
	FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_FAILED,
	SET_CONSUMER_PROCESSING_NUM_OF_ITEMS,
	SET_CONSUMER_TRACKED_NUM_OF_ITEMS,

	START_FETCH_CONSUMER_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
	START_FETCH_CONSUMER_TRACKED_ORDERS_NUMBER_OF_ITEMS,
} from './action-types';

export function setConsumerSelectedTabAction(selectedTab) {
	return {
		type: SET_CONSUMER_SELECTED_TAB,
		selectedTab,
	};
}

export function setConsumerProcessingSearchQueriesAction(processingSearchQueries) {
	return {
		type: SET_CONSUMER_PROCESSING_SEARCH_QUERIES,
		processingSearchQueries,
	};
}

export function setConsumerTrackedSearchQueriesAction(trackedSearchQueries) {
	return {
		type: SET_CONSUMER_TRACKED_SEARCH_QUERIES,
		trackedSearchQueries,
	};
}

export function setConsumerClosedSearchQueriesAction(closedSearchQueries) {
	return {
		type: SET_CONSUMER_CLOSED_SEARCH_QUERIES,
		closedSearchQueries,
	};
}

export function fetchConsumerProcessingOrdersAction(
	page,
	{
		handlerId,
		customerName,
		description,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_CONSUMER_PROCESSING_ORDERS,
		page,
		searchQueries: {
			handlerId,
			customerName,
			description,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchConsumerProcessingOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_CONSUMER_PROCESSING_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchConsumerProcessingOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CONSUMER_PROCESSING_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function fetchConsumerTrackedOrdersAction(
	page,
	{
		handlerId,
		customerName,
		description,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_CONSUMER_TRACKED_ORDERS,
		page,
		searchQueries: {
			handlerId,
			customerName,
			description,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchConsumerTrackedOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_CONSUMER_TRACKED_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchConsumerTrackedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CONSUMER_TRACKED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function fetchConsumerClosedOrdersAction(
	page,
	{
		handlerId,
		customerName,
		description,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_CONSUMER_CLOSED_ORDERS,
		page,
		searchQueries: {
			handlerId,
			customerName,
			description,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchConsumerClosedOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_CONSUMER_CLOSED_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchConsumerClosedOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CONSUMER_CLOSED_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function fetchConsumerNextProcessingOrdersAction(
	page,
	{
		handlerId,
		customerName,
		description,
		from,
		to,
		limit,
		order,
		sort,
	} = {}) {
	return {
		type: START_FETCH_CONSUMER_NEXT_PROCESSING_ORDERS,
		page,
		searchQueries: {
			handlerId,
			customerName,
			description,
			from,
			to,
			limit,
			order,
			sort,
		},
	};
}

export function fetchConsumerNextProcessingOrdersSuccessAction({
	data,
	page,
	numOfItems,
	numOfPages,
} = {}) {
	return {
		type: FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_SUCCESS,
		data,
		page,
		numOfItems,
		numOfPages,
	};
}

export function fetchConsumerNextProcessingOrdersFailedAction(error, errorMessage) {
	return {
		type: FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_FAILED,
		error,
		errorMessage,
	};
}

export function setConsumerProcessingNumOfItemsAction(numOfItems = 0) {
	return {
		type: SET_CONSUMER_PROCESSING_NUM_OF_ITEMS,
		numOfItems,
	};
}

export function setConsumerTrackedNumOfItemsAction(numOfItems = 0) {
	return {
		type: SET_CONSUMER_TRACKED_NUM_OF_ITEMS,
		numOfItems,
	};
}

// Number of item
export function fetchConsumerProcessingOrdersNumberOfItemsAction({
	handlerId,
	customerName,
	serialNumber,
	from,
	to,
} = {}) {
	return {
		type: START_FETCH_CONSUMER_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
		searchQueries: {
			handlerId,
			customerName,
			serialNumber,
			from,
			to,
		},
	};
}

export function fetchConsumerTrackedOrdersNumberOfItemsAction({
	handlerId,
	customerName,
	serialNumber,
	from,
	to,
} = {}) {
	return {
		type: START_FETCH_CONSUMER_TRACKED_ORDERS_NUMBER_OF_ITEMS,
		searchQueries: {
			handlerId,
			customerName,
			serialNumber,
			from,
			to,
		},
	};
}
