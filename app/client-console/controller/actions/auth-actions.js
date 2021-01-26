import {
	START_CHECK_AUTH,
	CHECK_AUTH_SUCCESS,
	CHECK_AUTH_FAILED,

	START_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILED,

	START_LOGOUT,
	LOGOUT_SUCCESS,
	LOGOUT_FAILED,

	START_UPDATE_CHANNEL_SETTINGS,
	UPDATE_CHANNEL_SETTINGS_SUCCESS,
	UPDATE_CHANNEL_SETTINGS_FAILED,

	UPDATE_ME_CHANNELS,
} from './action-types';

export function checkAuthAction() {
	return {
		type: START_CHECK_AUTH,
	};
}

export function checkAuthSuccessAction(me) {
	return {
		type: CHECK_AUTH_SUCCESS,
		me,
	};
}

export function checkAuthFailedAction(error, errorMessage) {
	return {
		type: CHECK_AUTH_FAILED,
		error,
		errorMessage,
	};
}

export function loginAction(username, password) {
	return {
		type: START_LOGIN,
		username,
		password,
	};
}

export function loginSuccessAction() {
	return {
		type: LOGIN_SUCCESS,
	};
}

export function loginFailedAction(error, errorMessage) {
	return {
		type: LOGIN_FAILED,
		error,
		errorMessage,
	};
}

export function logoutAction() {
	return {
		type: START_LOGOUT,
	};
}

export function logoutSuccessAction() {
	return {
		type: LOGOUT_SUCCESS,
	};
}

export function logoutFailedAction(error, errorMessage) {
	return {
		type: LOGOUT_FAILED,
		error,
		errorMessage,
	};
}

export function updateChannelSettingsAction(channelSettings) {
	return {
		type: START_UPDATE_CHANNEL_SETTINGS,
		channelSettings,
	};
}

export function updateChannelSettingsSuccessAction(channelSettings) {
	return {
		type: UPDATE_CHANNEL_SETTINGS_SUCCESS,
		channelSettings,
	};
}

export function updateChannelSettingsFailedAction(error, errorMessage) {
	return {
		type: UPDATE_CHANNEL_SETTINGS_FAILED,
		error,
		errorMessage,
	};
}

export function updateMeChannelsAction(channels) {
	return {
		type: UPDATE_ME_CHANNELS,
		channels,
	};
}
