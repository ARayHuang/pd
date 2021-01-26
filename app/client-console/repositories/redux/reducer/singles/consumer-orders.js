import { Map, List } from 'immutable';
import { actionTypes } from '../../../../controller';
import { isDateValid, convertDateStringToTimestamp } from '../../../../../lib/moment-utils';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { updateOrderHasNewActivityStatus } from './utils';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	SET_CONSUMER_SELECTED_TAB,
	SET_CONSUMER_PROCESSING_SEARCH_QUERIES,
	SET_CONSUMER_TRACKED_SEARCH_QUERIES,
	SET_CONSUMER_CLOSED_SEARCH_QUERIES,
	SET_CONSUMER_PROCESSING_NUM_OF_ITEMS,
	SET_CONSUMER_TRACKED_NUM_OF_ITEMS,

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

	UPDATE_HAS_NEW_ACTIVITY,

	UPDATE_ORDER_FROM_INVITATION_UPDATED,
	ADD_ORDER_FROM_INVITATION_UPDATED,
	REMOVE_ORDER_FROM_INVITATION_UPDATED,
} = actionTypes;
const initialState = Map({
	data: Map({
		orders: List(),
		page: 1,
		numOfItems: 0,
		numOfPages: 1,
	}),
	selectedTab: '',
	processingSearchQueries: Map(),
	trackedSearchQueries: Map(),
	closedSearchQueries: Map(),

	processingNumOfItems: 0,
	trackedNumOfItems: 0,

	fetchConsumerProcessingOrdersLoadingStatus: NONE,
	fetchConsumerProcessingOrdersLoadingStatusMessage: '',

	fetchConsumerTrackedOrdersLoadingStatus: NONE,
	fetchConsumerTrackedOrdersLoadingStatusMessage: '',

	fetchConsumerClosedOrdersLoadingStatus: NONE,
	fetchConsumerClosedOrdersLoadingStatusMessage: '',
});

export default function consumerOrders(state = initialState, action) {
	switch (action.type) {
		case SET_CONSUMER_SELECTED_TAB:
			return state
				.set('selectedTab', action.selectedTab);

		case SET_CONSUMER_PROCESSING_SEARCH_QUERIES:
			return state
				.set('processingSearchQueries', Map(action.processingSearchQueries));

		case SET_CONSUMER_TRACKED_SEARCH_QUERIES:
			return state
				.set('trackedSearchQueries', Map(action.trackedSearchQueries));

		case SET_CONSUMER_CLOSED_SEARCH_QUERIES:
			return state
				.set('closedSearchQueries', Map(action.closedSearchQueries));

		case START_FETCH_CONSUMER_PROCESSING_ORDERS:
			return state
				.set('fetchConsumerProcessingOrdersLoadingStatus', LOADING);

		case FETCH_CONSUMER_PROCESSING_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('processingNumOfItems', numOfItems)
				.set('fetchConsumerProcessingOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_CONSUMER_PROCESSING_ORDERS_FAILED:
			return state
				.set('fetchConsumerProcessingOrdersLoadingStatus', FAILED)
				.set('fetchConsumerProcessingOrdersLoadingStatusMessage', action.errorMessage);

		case START_FETCH_CONSUMER_TRACKED_ORDERS:
			return state
				.set('fetchConsumerTrackedOrdersLoadingStatus', LOADING);

		case FETCH_CONSUMER_TRACKED_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('trackedNumOfItems', numOfItems)
				.set('fetchConsumerTrackedOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_CONSUMER_TRACKED_ORDERS_FAILED:
			return state
				.set('fetchConsumerTrackedOrdersLoadingStatus', FAILED)
				.set('fetchConsumerTrackedOrdersLoadingStatusMessage', action.errorMessage);

		case START_FETCH_CONSUMER_CLOSED_ORDERS:
			return state
				.set('fetchConsumerClosedOrdersLoadingStatus', LOADING);

		case FETCH_CONSUMER_CLOSED_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('fetchConsumerClosedOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_CONSUMER_CLOSED_ORDERS_FAILED:
			return state
				.set('fetchConsumerClosedOrdersLoadingStatus', FAILED)
				.set('fetchConsumerClosedOrdersLoadingStatusMessage', action.errorMessage);

		case START_FETCH_CONSUMER_NEXT_PROCESSING_ORDERS:
			return state
				.set('fetchConsumerProcessingOrdersLoadingStatus', LOADING);

		case FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;
			const currentOrders = state.getIn(['data', 'orders']);

			return state
				.setIn(['data', 'orders'], currentOrders.concat(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('fetchConsumerProcessingOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_CONSUMER_NEXT_PROCESSING_ORDERS_FAILED:
			return state
				.set('fetchConsumerProcessingOrdersLoadingStatus', FAILED)
				.set('fetchConsumerProcessingOrdersLoadingStatusMessage', action.errorMessage);

		case SET_CONSUMER_PROCESSING_NUM_OF_ITEMS:
			return state
				.set('processingNumOfItems', action.numOfItems);

		case SET_CONSUMER_TRACKED_NUM_OF_ITEMS:
			return state
				.set('trackedNumOfItems', action.numOfItems);

		case UPDATE_HAS_NEW_ACTIVITY:
			return state.updateIn(
				['data', 'orders'],
				orders => List(orders.map(order => updateOrderHasNewActivityStatus(order, action.order))),
			);

		case ADD_ORDER_FROM_INVITATION_UPDATED: {
			return state
				.updateIn(
					['data', 'orders'],
					orders => List(
						orders
							.push(action.order)
							.sort(({ createdAt: prev }, { createdAt: next }) => {
								if (isDateValid(prev) && isDateValid(next)) {
									return convertDateStringToTimestamp(prev) - convertDateStringToTimestamp(next);
								}

								return false;
							}),
					),
				)
				.updateIn(['processingNumOfItems'], processingNumOfItems => processingNumOfItems + 1);
		}

		case REMOVE_ORDER_FROM_INVITATION_UPDATED:
			return state
				.updateIn(
					['data', 'orders'],
					orders => List(orders.filter(order => order.id !== action.orderId)),
				)
				.updateIn(['processingNumOfItems'], processingNumOfItems => processingNumOfItems - 1);

		case UPDATE_ORDER_FROM_INVITATION_UPDATED: {
			return state.updateIn(
				['data', 'orders'],
				orders => List(orders.map(order => {
					const { nextOrder = {} } = action;

					if (order.id === nextOrder.id) {
						return Object.assign(order, nextOrder);
					}

					return order;
				})),
			);
		}

		default:
			return state;
	}
}
