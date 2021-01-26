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
	START_FETCH_ONLINE_USERS,
	FETCH_ONLINE_USERS_SUCCESS,
	FETCH_ONLINE_USERS_FAILED,
} = actionTypes;
const defaultData = Map({
	onlineUsers: new List(),
	numOfItems: 0,
	numOfPages: 1,
});
const initialState = Map({
	data: defaultData,

	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function OnlineUsers(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_ONLINE_USERS:
			return state.set('loadingStatus', LOADING);

		case FETCH_ONLINE_USERS_SUCCESS: {
			const { onlineUsers } = action;
			const { data, numOfItems, numOfPages } = onlineUsers ? onlineUsers : {};

			return state
				.setIn(['data', 'onlineUsers'], new List(data))
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_ONLINE_USERS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('data', defaultData)
				.set('loadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
