import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
	START_FETCH_ORDERS,
	FETCH_ORDERS_SUCCESS,
	FETCH_ORDERS_FAILED,
} = actionTypes;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const initialState = Map({
	data: Map({
		orders: List(),
		page: 1,
		numOfItems: 0,
		numOfPages: 1,
	}),

	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function orders(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_ORDERS:
			return state.set('loadingStatus', LOADING);

		case FETCH_ORDERS_SUCCESS: {
			const { orders, page, numOfItems, numOfPages } = action;

			return state
				.setIn(['data', 'orders'], List(orders))
				.setIn(['data', 'page'], page)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_ORDERS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
