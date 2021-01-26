import { Map, List } from 'immutable';
import { actionTypes } from '../../../../controller';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { updateOrderHasNewActivityStatus } from './utils';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	RESET_ORDERS,
	SET_SELECTED_TAB,
	SET_PROCESSING_SEARCH_QUERIES,
	SET_TRACKED_SEARCH_QUERIES,
	SET_CLOSED_SEARCH_QUERIES,
	SET_PROCESSING_NUM_OF_ITEMS,
	SET_TRACKED_NUM_OF_ITEMS,

	START_FETCH_PROCESSING_ORDERS,
	FETCH_PROCESSING_ORDERS_SUCCESS,
	FETCH_PROCESSING_ORDERS_FAILED,

	START_FETCH_TRACKED_ORDERS,
	FETCH_TRACKED_ORDERS_SUCCESS,
	FETCH_TRACKED_ORDERS_FAILED,

	START_FETCH_CLOSED_ORDERS,
	FETCH_CLOSED_ORDERS_SUCCESS,
	FETCH_CLOSED_ORDERS_FAILED,

	START_FETCH_NEXT_PROCESSING_ORDERS,
	FETCH_NEXT_PROCESSING_ORDERS_SUCCESS,
	FETCH_NEXT_PROCESSING_ORDERS_FAILED,

	UPDATE_HAS_NEW_ACTIVITY,
	SOCKET_INSERT_ONE_OF_ORDERS,

	UPDATE_ORDER_FROM_INVITATION_UPDATED,
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

	fetchProcessingOrdersLoadingStatus: NONE,
	fetchProcessingOrdersLoadingStatusMessage: '',

	fetchTrackedOrdersLoadingStatus: NONE,
	fetchTrackedOrdersLoadingStatusMessage: '',

	fetchClosedOrdersLoadingStatus: NONE,
	fetchClosedOrdersLoadingStatusMessage: '',
});

export default function orders(state = initialState, action) {
	switch (action.type) {
		case SOCKET_INSERT_ONE_OF_ORDERS: {
			const { order } = action;
			const orders = state.getIn(['data', 'orders']);
			const updatedOrders = orders.unshift(order);

			return state
				.setIn(['data', 'orders'], updatedOrders);
		}

		case SET_SELECTED_TAB:
			return state
				.set('selectedTab', action.selectedTab);

		case SET_PROCESSING_SEARCH_QUERIES:
			return state
				.set('processingSearchQueries', Map(action.processingSearchQueries));

		case SET_TRACKED_SEARCH_QUERIES:
			return state
				.set('trackedSearchQueries', Map(action.trackedSearchQueries));

		case SET_CLOSED_SEARCH_QUERIES:
			return state
				.set('closedSearchQueries', Map(action.closedSearchQueries));

		case START_FETCH_PROCESSING_ORDERS:
			return state
				.set('fetchProcessingOrdersLoadingStatus', LOADING);

		case FETCH_PROCESSING_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('processingNumOfItems', numOfItems)
				.set('fetchProcessingOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_PROCESSING_ORDERS_FAILED:
			return state
				.set('fetchProcessingOrdersLoadingStatus', FAILED)
				.set('fetchProcessingOrdersLoadingStatusMessage', action.errorMessage);

		case START_FETCH_TRACKED_ORDERS:
			return state
				.set('fetchTrackedOrdersLoadingStatus', LOADING);

		case FETCH_TRACKED_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('trackedNumOfItems', numOfItems)
				.set('fetchTrackedOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_TRACKED_ORDERS_FAILED:
			return state
				.set('fetchTrackedOrdersLoadingStatus', FAILED)
				.set('fetchTrackedOrdersLoadingStatusMessage', action.errorMessage);

		case START_FETCH_CLOSED_ORDERS:
			return state
				.set('fetchClosedOrdersLoadingStatus', LOADING);

		case FETCH_CLOSED_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('fetchClosedOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_CLOSED_ORDERS_FAILED:
			return state
				.set('fetchClosedOrdersLoadingStatus', FAILED)
				.set('fetchClosedOrdersLoadingStatusMessage', action.errorMessage);

		case RESET_ORDERS:
			return state
				.set('data', Map({
					orders: List(),
					page: 1,
					numOfItems: 0,
					numOfPages: 1,
				}))
				.set('selectedTab', '');

		case START_FETCH_NEXT_PROCESSING_ORDERS:
			return state
				.set('fetchProcessingOrdersLoadingStatus', LOADING);

		case FETCH_NEXT_PROCESSING_ORDERS_SUCCESS: {
			const { data, numOfItems, numOfPages, page } = action;
			const currentOrders = state.getIn(['data', 'orders']);

			return state
				.setIn(['data', 'orders'], currentOrders.concat(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('fetchProcessingOrdersLoadingStatus', SUCCESS);
		}

		case FETCH_NEXT_PROCESSING_ORDERS_FAILED:
			return state
				.set('fetchProcessingOrdersLoadingStatus', FAILED)
				.set('fetchProcessingOrdersLoadingStatusMessage', action.errorMessage);

		case SET_PROCESSING_NUM_OF_ITEMS:
			return state
				.set('processingNumOfItems', action.numOfItems);

		case SET_TRACKED_NUM_OF_ITEMS:
			return state
				.set('trackedNumOfItems', action.numOfItems);

		case UPDATE_HAS_NEW_ACTIVITY:
			return state.updateIn(
				['data', 'orders'],
				orders => List(orders.map(order => updateOrderHasNewActivityStatus(order, action.order))),
			);

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
