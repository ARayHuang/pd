import { ofType } from 'redux-observable';
import {
	switchMap,
	map,
	catchError,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	consumerOrderActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	notifyErrorAction,
} = notifyActions;
const {
	fetchConsumerProcessingOrdersSuccessAction,
	fetchConsumerProcessingOrdersFailedAction,
	fetchConsumerTrackedOrdersSuccessAction,
	fetchConsumerTrackedOrdersFailedAction,
	fetchConsumerClosedOrdersSuccessAction,
	fetchConsumerClosedOrdersFailedAction,
	fetchConsumerNextProcessingOrdersSuccessAction,
	fetchConsumerNextProcessingOrdersFailedAction,
	setConsumerProcessingNumOfItemsAction,
	setConsumerTrackedNumOfItemsAction,
} = consumerOrderActions;
const {
	START_FETCH_CONSUMER_PROCESSING_ORDERS,
	START_FETCH_CONSUMER_TRACKED_ORDERS,
	START_FETCH_CONSUMER_CLOSED_ORDERS,
	START_FETCH_CONSUMER_NEXT_PROCESSING_ORDERS,
	START_FETCH_CONSUMER_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
	START_FETCH_CONSUMER_TRACKED_ORDERS_NUMBER_OF_ITEMS,
} = actionTypes;
const {
	SKIP_EMPTY_STRING,
	SKIP_UNDEFINED,
	SKIP_NULL,
} = objectFilterOptionEnums;
const options = [SKIP_EMPTY_STRING, SKIP_UNDEFINED, SKIP_NULL];
const LIMIT = 500;
const ORDER = 'asc';

export function fetchConsumerProcessingOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_PROCESSING_ORDERS),
		switchMap(({
			page,
			searchQueries: {
				handlerId,
				customerName,
				description,
				from,
				to,
				limit = LIMIT,
				order = ORDER,
				sort,
			},
		} = {}) => rxjsApiFetcher
			.get('/orders?status=accepted&status=resolved', {
				queries: objectFilter({
					page,
					handlerId,
					customerName,
					description,
					from,
					to,
					limit,
					order,
					sort,
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchConsumerProcessingOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchConsumerProcessingOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchConsumerProcessingOrdersNumberOfItemsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_PROCESSING_ORDERS_NUMBER_OF_ITEMS),
		switchMap(({
			searchQueries: {
				handlerId,
				customerName,
				serialNumber,
				from,
				to,
			},
		}) => rxjsApiFetcher
			.get('/orders?status=accepted&status=resolved', {
				queries: objectFilter({
					handlerId,
					customerName,
					serialNumber,
					from,
					to,
					limit: 1,
				}, options),
			})
			.pipe(
				map(({ response }) => {
					return setConsumerProcessingNumOfItemsAction(response.numOfItems);
				}),
				catchError(error => catchErrorMessageForEpics(error, notifyErrorAction)),
			),
		),
	);
}

export function fetchConsumerTrackedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_TRACKED_ORDERS),
		switchMap(({
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
		} = {}) => rxjsApiFetcher
			.get('/orders?status=tracked', {
				queries: objectFilter({
					page,
					handlerId,
					customerName,
					description,
					from,
					to,
					limit,
					order,
					sort,
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchConsumerTrackedOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchConsumerTrackedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchConsumerTrackedOrdersNumberOfItemsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_TRACKED_ORDERS_NUMBER_OF_ITEMS),
		switchMap(({
			searchQueries: {
				handlerId,
				customerName,
				serialNumber,
				from,
				to,
			},
		}) => rxjsApiFetcher
			.get('/orders?status=tracked', {
				queries: objectFilter({
					handlerId,
					customerName,
					serialNumber,
					from,
					to,
					limit: 1,
				}, options),
			})
			.pipe(
				map(({ response }) => {
					return setConsumerTrackedNumOfItemsAction(response.numOfItems);
				}),
				catchError(error => catchErrorMessageForEpics(error, notifyErrorAction)),
			),
		),
	);
}

export function fetchConsumerClosedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_CLOSED_ORDERS),
		switchMap(({
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
		} = {}) => rxjsApiFetcher
			.get('/orders?status=completed&status=deleted', {
				queries: objectFilter({
					page,
					handlerId,
					customerName,
					description,
					from,
					to,
					limit,
					order,
					sort,
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchConsumerClosedOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchConsumerClosedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchConsumerNextProcessingOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CONSUMER_NEXT_PROCESSING_ORDERS),
		switchMap(({
			page,
			searchQueries: {
				handlerId,
				customerName,
				description,
				from,
				to,
				limit = LIMIT,
				order = ORDER,
				sort,
			},
		} = {}) => rxjsApiFetcher
			.get('/orders?status=accepted&status=resolved', {
				queries: objectFilter({
					page,
					handlerId,
					customerName,
					description,
					from,
					to,
					limit,
					order,
					sort,
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchConsumerNextProcessingOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchConsumerNextProcessingOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}
