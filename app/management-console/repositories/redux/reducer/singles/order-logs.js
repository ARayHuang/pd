import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
	START_FETCH_ORDER_LOGS,
	FETCH_ORDER_LOGS_SUCCESS,
	FETCH_ORDER_LOGS_FAILED,
} = actionTypes;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const initialState = Map({
	data: Map({
		logs: List(),
		numOfItems: 0,
		numOfPages: 1,
	}),

	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function orderLogs(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_ORDER_LOGS:
			return state.set('loadingStatus', LOADING);

		case FETCH_ORDER_LOGS_SUCCESS: {
			const { logs, numOfItems, numOfPages } = action;

			return state
				.setIn(['data', 'logs'], List(logs))
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_ORDER_LOGS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
