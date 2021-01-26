import {
	START_FETCH_CHANNELS,
	FETCH_CHANNELS_SUCCESS,
	FETCH_CHANNELS_FAILED,
	START_CREATE_CHANNEL,
	CREATE_CHANNEL_SUCCESS,
	CREATE_CHANNEL_FAILED,
	START_UPDATE_CHANNEL,
	UPDATE_CHANNEL_SUCCESS,
	UPDATE_CHANNEL_FAILED,
	START_DELETE_CHANNEL,
	DELETE_CHANNEL_SUCCESS,
	DELETE_CHANNEL_FAILED,
	START_FETCH_CHANNEL_OPTIONS,
	FETCH_CHANNEL_OPTIONS_SUCCESS,
	FETCH_CHANNEL_OPTIONS_FAILED,
} from './action-types';

export function fetchChannelsAction({
	sort,
	order,
	limit,
	page,
} = {}) {
	return {
		type: START_FETCH_CHANNELS,
		sort,
		order,
		limit,
		page,
	};
}

export function fetchChannelsSuccessAction({
	data,
	numOfItems,
	numOfPages,
	nextPage,
} = {}) {
	return {
		type: FETCH_CHANNELS_SUCCESS,
		data,
		numOfItems,
		numOfPages,
		nextPage,
	};
}

export function fetchChannelsFailedAction(error, errorMessage) {
	return {
		type: FETCH_CHANNELS_FAILED,
		error,
		errorMessage,
	};
}

export function createChannelAction(name) {
	return {
		type: START_CREATE_CHANNEL,
		name,
	};
}

export function createChannelSuccessAction() {
	return {
		type: CREATE_CHANNEL_SUCCESS,
	};
}

export function createChannelFailedAction(error, errorMessage) {
	return {
		type: CREATE_CHANNEL_FAILED,
		error,
		errorMessage,
	};
}

export function updateChannelAction(channelId, name) {
	return {
		type: START_UPDATE_CHANNEL,
		channelId,
		name,
	};
}

export function updateChannelSuccessAction() {
	return {
		type: UPDATE_CHANNEL_SUCCESS,
	};
}

export function updateChannelFailedAction(error, errorMessage) {
	return {
		type: UPDATE_CHANNEL_FAILED,
		error,
		errorMessage,
	};
}

export function deleteChannelAction(channelId) {
	return {
		type: START_DELETE_CHANNEL,
		channelId,
	};
}

export function deleteChannelSuccessAction() {
	return {
		type: DELETE_CHANNEL_SUCCESS,
	};
}

export function deleteChannelFailedAction(error, errorMessage) {
	return {
		type: DELETE_CHANNEL_FAILED,
		error,
		errorMessage,
	};
}

export function fetchChannelOptionsAction() {
	return {
		type: START_FETCH_CHANNEL_OPTIONS,
	};
}

export function fetchChannelOptionsSuccessAction(channelOptions) {
	return {
		type: FETCH_CHANNEL_OPTIONS_SUCCESS,
		channelOptions,
	};
}

export function fetchChannelOptionsFailedAction(error, errorMessage) {
	return {
		type: FETCH_CHANNEL_OPTIONS_FAILED,
		error,
		errorMessage,
	};
}
