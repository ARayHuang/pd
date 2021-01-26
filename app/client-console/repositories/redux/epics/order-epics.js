import { ofType } from 'redux-observable';
import {
	switchMap,
	mergeMap,
	map,
	catchError,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	orderActions,
	notifyActions,
	channelActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';
import { DepartmentTypeEnums } from '../../../../lib/enums';

const {
	START_FETCH_PROCESSING_ORDERS,
	START_FETCH_TRACKED_ORDERS,
	START_FETCH_CLOSED_ORDERS,
	START_FETCH_NEXT_PROCESSING_ORDERS,

	START_FETCH_ORDER,
	START_CREATE_ORDER,
	START_DELETE_ORDER,
	START_COMPLETE_ORDER,
	START_TRACK_ORDER,
	START_ACCEPT_ORDER,
	START_RESOLVE_ORDER,
	START_INVITE_ORDER,
	START_ACCEPT_INVITATION_ORDER,

	START_UPDATE_HAD_READ_ORDER,
	START_UPDATE_ORDER_NUMBER,

	START_FETCH_PROCESSING_ORDERS_NUMBER_OF_ITEMS,
	START_FETCH_TRACKED_ORDERS_NUMBER_OF_ITEMS,
} = actionTypes;
const {
	notifyErrorAction,
} = notifyActions;
const {
	fetchProcessingOrdersSuccessAction,
	fetchProcessingOrdersFailedAction,
	fetchTrackedOrdersSuccessAction,
	fetchTrackedOrdersFailedAction,
	fetchClosedOrdersSuccessAction,
	fetchClosedOrdersFailedAction,
	fetchOrderSuccessAction,
	fetchOrderFailedAction,
	createOrderSuccessAction,
	createOrderFailedAction,
	fetchNextProcessingOrdersSuccessAction,
	fetchNextProcessingOrdersFailedAction,
	deleteOrderSuccessAction,
	deleteOrderFailedAction,
	completeOrderSuccessAction,
	completeOrderFailedAction,
	trackOrderSuccessAction,
	trackOrderFailedAction,
	acceptOrderSuccessAction,
	acceptOrderFailedAction,
	resolveOrderSuccessAction,
	resolveOrderFailedAction,
	inviteOrderSuccessAction,
	inviteOrderFailedAction,
	acceptInvitationOrderSuccessAction,
	acceptInvitationOrderFailedAction,
	updateOrderNumberSuccessAction,
	updateOrderNumberFailedAction,
	updateHadReadOrderSuccessAction,
	updateHadReadOrderFailedAction,
	setSelectedOrderIdAction,
	setProcessingNumOfItemsAction,
	setTrackedNumOfItemsAction,
} = orderActions;
const {
	setSelectedChannelAction,
} = channelActions;
const {
	SKIP_EMPTY_STRING,
	SKIP_UNDEFINED,
	SKIP_NULL,
} = objectFilterOptionEnums;
const options = [SKIP_EMPTY_STRING, SKIP_UNDEFINED, SKIP_NULL];

export function fetchOrderEpic(action$, state$) {
	return action$.pipe(
		ofType(START_FETCH_ORDER),
		switchMap(({ orderId }) => {
			const {
				auth,
				createdOrders,
				consumerOrders,
			} = state$.value;
			const isConsumer = auth.getIn(['me', 'departmentType']) === DepartmentTypeEnums.CONSUMER;
			let currentChannel = {};

			if (isConsumer) {
				currentChannel = consumerOrders
					.getIn(['data', 'orders'])
					.concat(createdOrders.getIn(['data', 'orders']))
					.find(order => order.id === orderId)
					.channel;
			}

			return rxjsApiFetcher
				.get(`/orders/id=${orderId}`)
				.pipe(
					mergeMap((payload = {}) => {
						const dispatchActions = [fetchOrderSuccessAction(payload.response)];

						if (isConsumer) {
							dispatchActions.unshift(setSelectedChannelAction(currentChannel));
						}

						return dispatchActions;
					}),
					catchError(error => catchErrorMessageForEpics(error, fetchOrderFailedAction, notifyErrorAction)),
				);
		}),
	);
}

export function fetchProcessingOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_PROCESSING_ORDERS),
		switchMap(({
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
				limit = 500,
				order,
				sort,
			},
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=created&status=accepted&status=resolved`, {
				queries: objectFilter({
					page,
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
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchProcessingOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchProcessingOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchProcessingOrdersNumberOfItemsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_PROCESSING_ORDERS_NUMBER_OF_ITEMS),
		switchMap(({
			channelId,
			searchQueries: {
				handlerId,
				customerName,
				serialNumber,
				from,
				to,
			},
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=created&status=accepted&status=resolved`, {
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
					return setProcessingNumOfItemsAction(response.numOfItems);
				}),
				catchError(error => catchErrorMessageForEpics(error, notifyErrorAction)),
			),
		),
	);
}

export function fetchTrackedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_TRACKED_ORDERS),
		switchMap(({
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
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=tracked`, {
				queries: objectFilter({
					page,
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
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchTrackedOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchTrackedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchTrackedOrdersNumberOfItemsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_TRACKED_ORDERS_NUMBER_OF_ITEMS),
		switchMap(({
			channelId,
			searchQueries: {
				handlerId,
				customerName,
				serialNumber,
				from,
				to,
			},
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=tracked`, {
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
					return setTrackedNumOfItemsAction(response.numOfItems);
				}),
				catchError(error => catchErrorMessageForEpics(error, notifyErrorAction)),
			),
		),
	);
}

export function fetchClosedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CLOSED_ORDERS),
		switchMap(({
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
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=completed&status=deleted`, {
				queries: objectFilter({
					page,
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
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchClosedOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchClosedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createOrderEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_ORDER),
		switchMap(action => rxjsApiFetcher
			.post(`/channels/id=${action.channelId}/orders`, {
				...action.data,
			})
			.pipe(
				mergeMap(({ response: { id = '' } = {} } = {}) => [
					setSelectedOrderIdAction(id),
					createOrderSuccessAction(),
				]),
				catchError(error => catchErrorMessageForEpics(error, createOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchNextProcessingOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_NEXT_PROCESSING_ORDERS),
		switchMap(({
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
				limit = 500,
				order,
				sort,
			},
		} = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders?status=created&status=accepted&status=resolved`, {
				queries: objectFilter({
					page,
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
				}, options),
			})
			.pipe(
				map(payload => {
					const params = {
						page,
						...payload.response,
					};

					return fetchNextProcessingOrdersSuccessAction(params);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchNextProcessingOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function deleteOrderEpic(action$) {
	return action$.pipe(
		ofType(START_DELETE_ORDER),
		switchMap(action => rxjsApiFetcher
			.delete(`/channels/id=${action.channelId}/orders/id=${action.orderId}`)
			.pipe(
				map(() => deleteOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, deleteOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function completeOrderEpic(action$) {
	return action$.pipe(
		ofType(START_COMPLETE_ORDER),
		switchMap(({ channelId, orderId } = {}) => rxjsApiFetcher
			.post(`/channels/id=${channelId}/orders/id=${orderId}/completed`)
			.pipe(
				map(() => completeOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, completeOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function trackOrderEpic(action$) {
	return action$.pipe(
		ofType(START_TRACK_ORDER),
		switchMap(action => rxjsApiFetcher
			.post(`/channels/id=${action.channelId}/orders/id=${action.orderId}/tracked`)
			.pipe(
				map(() => trackOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, trackOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function acceptOrderEpic(action$) {
	return action$.pipe(
		ofType(START_ACCEPT_ORDER),
		switchMap(({ channelId, orderId }) => rxjsApiFetcher
			.post(`/channels/id=${channelId}/orders/id=${orderId}/accepted`)
			.pipe(
				mergeMap(() => [
					setSelectedOrderIdAction(orderId),
					acceptOrderSuccessAction(),
				]),
				catchError(error => catchErrorMessageForEpics(error, acceptOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function resolveOrderEpic(action$) {
	return action$.pipe(
		ofType(START_RESOLVE_ORDER),
		switchMap(({ channelId, orderId }) => rxjsApiFetcher
			.post(`/channels/id=${channelId}/orders/id=${orderId}/resolved`)
			.pipe(
				mergeMap(() => [
					setSelectedOrderIdAction(orderId),
					resolveOrderSuccessAction(),
				]),
				catchError(error => catchErrorMessageForEpics(error, resolveOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function inviteOrderEpic(action$) {
	return action$.pipe(
		ofType(START_INVITE_ORDER),
		switchMap(({ orderId, userId, invitationType }) => rxjsApiFetcher
			.post(`/orders/id=${orderId}/invitations`, { userId }, { queries: { type: invitationType } })
			.pipe(
				map(() => inviteOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, inviteOrderFailedAction, notifyErrorAction)),
			)),
	);
}

export function acceptInvitationOrderEpic(action$) {
	return action$.pipe(
		ofType(START_ACCEPT_INVITATION_ORDER),
		switchMap(({ invitationId }) => rxjsApiFetcher
			.post(`/invitations/id=${invitationId}/accepted`)
			.pipe(
				map(() => acceptInvitationOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, acceptInvitationOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateOrderNumberEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_ORDER_NUMBER),
		switchMap(({ orderId, orderNumber }) => rxjsApiFetcher
			.put(`/orders/id=${orderId}/description`, { description: orderNumber })
			.pipe(
				map(() => updateOrderNumberSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, updateOrderNumberFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateHadReadOrderEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_HAD_READ_ORDER),
		switchMap(({ channelId, orderId }) => rxjsApiFetcher
			.post(`/channels/id=${channelId}/orders/id=${orderId}/read`)
			.pipe(
				map(() => updateHadReadOrderSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, updateHadReadOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}
