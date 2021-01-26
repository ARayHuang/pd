import {
	START_FETCH_ONLINE_USERS,
	FETCH_ONLINE_USERS_SUCCESS,
	FETCH_ONLINE_USERS_FAILED,
} from './action-types';

export function fetchOnlineUsersAction(channelId) {
	return {
		type: START_FETCH_ONLINE_USERS,
		channelId,
	};
}

export function fetchOnlineUsersSuccessAction(onlineUsers = {}) {
	return {
		type: FETCH_ONLINE_USERS_SUCCESS,
		onlineUsers,
	};
}

export function fetchOnlineUsersFailedAction(error, errorMessage) {
	return {
		type: FETCH_ONLINE_USERS_FAILED,
		error,
		errorMessage,
	};
}
