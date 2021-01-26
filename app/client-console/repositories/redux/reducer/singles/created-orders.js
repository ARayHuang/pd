import { Map, List } from 'immutable';
import { actionTypes } from '../../../../controller';
import { LoadingStatusEnum } from '../../../../lib/enums';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	START_FETCH_CREATED_ORDERS,
	FETCH_CREATED_ORDERS_SUCCESS,
	FETCH_CREATED_ORDERS_FAILED,
	START_FETCH_NEXT_CREATED_ORDERS,
	FETCH_NEXT_CREATED_ORDERS_SUCCESS,
	FETCH_NEXT_CREATED_ORDERS_FAILED,
	SET_CREATED_ORDERS_NUM_OF_ITEMS,
	SOCKET_APPEND_CREATED_ORDER,
} = actionTypes;
const initialState = Map({
	data: Map({
		orders: List(),
		page: 1,
		numOfItems: 0,
		numOfPages: 1,
	}),

	loadingStatus: NONE,
	loadingStatusMessge: '',
});

export default function orders(state = initialState, action) {
	switch (action.type) {
		case SOCKET_APPEND_CREATED_ORDER: {
			const { order } = action;
			const currentOrders = state.getIn(['data', 'orders']);

			return state
				.setIn(['data', 'orders'], currentOrders.concat(order));
		}

		case SET_CREATED_ORDERS_NUM_OF_ITEMS:
			return state.setIn(['data', 'numOfItems'], action.numOfItems);

		case START_FETCH_CREATED_ORDERS:
			return state
				.set('loadingStatus', LOADING);

		case FETCH_CREATED_ORDERS_SUCCESS: {
			const { createdOrders } = action;
			const { data, numOfItems, numOfPages } = createdOrders;

			return state
				.setIn(['data', 'orders'], List(data))
				.setIn(['data', 'page'], 1)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_CREATED_ORDERS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_FETCH_NEXT_CREATED_ORDERS:
			return state
				.set('loadingStatus', LOADING);

		case FETCH_NEXT_CREATED_ORDERS_SUCCESS: {
			const { createdOrders, page } = action;
			const { data, numOfItems, numOfPages } = createdOrders;
			const currentOrders = state.getIn(['data', 'orders']);

			return state
				.setIn(['data', 'orders'], currentOrders.concat(data))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_NEXT_CREATED_ORDERS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
