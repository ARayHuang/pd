import { Map } from 'immutable';
import { actionTypes } from '../../../../controller';
import { LoadingStatusEnum } from '../../../../lib/enums';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	START_CHECK_AUTH,
	CHECK_AUTH_SUCCESS,
	CHECK_AUTH_FAILED,
	START_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	START_LOGOUT,
	LOGOUT_SUCCESS,
	LOGOUT_FAILED,
	UPDATE_ME_CHANNELS,
	START_UPDATE_CHANNEL_SETTINGS,
	UPDATE_CHANNEL_SETTINGS_SUCCESS,
	UPDATE_CHANNEL_SETTINGS_FAILED,
} = actionTypes;
const initialState = Map({
	me: Map(),
	departmentType: '',

	loadingStatus: NONE,
	loadingStatusMessage: '',

	loginLoadingStatus: NONE,
	loginLoadingStatusMessage: '',

	logoutLoadingStatus: NONE,
	logoutLoadingStatusMessage: '',

	updateChannelSettingsLoadingStatus: NONE,
	updateChannelSettingsLoadingStatusMessage: '',
});

export default function auth(state = initialState, action) {
	switch (action.type) {
		case START_CHECK_AUTH:
			return state.set('loadingStatus', LOADING);

		case CHECK_AUTH_SUCCESS:
			return state
				.set('me', Map(action.me))
				.set('departmentType', action.me.departmentType)
				.set('loadingStatus', SUCCESS);

		case CHECK_AUTH_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

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

		case UPDATE_ME_CHANNELS:
			return state
				.setIn(['me', 'channels'], action.channels);

		case START_UPDATE_CHANNEL_SETTINGS:
			return state.set('updateChannelSettingsLoadingStatus', LOADING);

		case UPDATE_CHANNEL_SETTINGS_SUCCESS:
			return state
				.setIn(['me', 'channelSettings'], action.channelSettings);

		case UPDATE_CHANNEL_SETTINGS_FAILED:
			return state
				.set('updateChannelSettingsLoadingStatus', FAILED)
				.set('updateChannelSettingsLoadingStatusMessage', action.errorMessage);
		default:
			return state;
	}
}
