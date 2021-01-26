import { Map } from 'immutable';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
	START_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	START_LOGOUT,
	LOGOUT_SUCCESS,
	LOGOUT_FAILED,
	START_CHECK_AUTH,
	CHECK_AUTH_SUCCESS,
	CHECK_AUTH_FAILED,
} = actionTypes;
const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const initialState = Map({
	me: Map(),

	loadingStatus: NONE,
	loadingStatusMessage: '',

	loginLoadingStatus: NONE,
	loginLoadingStatusMessage: '',

	logoutLoadingStatus: NONE,
	logoutLoadingStatusMessage: '',
});

export default function auth(state = initialState, action) {
	switch (action.type) {
		case START_LOGIN:
			return state.set('loginLoadingStatus', LOADING);

		case LOGIN_SUCCESS:
			return state.set('loginLoadingStatus', SUCCESS);

		case LOGIN_FAILED:
			return state
				.set('loginLoadingStatus', FAILED)
				.set('loginLoadingStatusMessage', action.errorMessage);

		case START_LOGOUT:
			return state.set('logoutLoadingStatus', LOADING);

		case LOGOUT_SUCCESS:
			return state
				.set('logoutLoadingStatus', SUCCESS)
				.set('loadingStatus', NONE);

		case LOGOUT_FAILED:
			return state
				.set('logoutLoadingStatus', FAILED)
				.set('logoutLoadingStatusMessage', action.errorMessage);

		case START_CHECK_AUTH:
			return state.set('loadingStatus', LOADING);

		case CHECK_AUTH_SUCCESS:
			return state
				.set('me', Map(action.me))
				.set('loadingStatus', SUCCESS);

		case CHECK_AUTH_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);
		default:
			return state;
	}
}
