import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
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
} = actionTypes;
const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const initialState = Map({
	data: Map({
		channels: List(),
		page: 1,
		numOfItems: 0,
		numOfPages: 1,
	}),
	channelOptions: List(),

	loadingStatus: NONE,
	loadingStatusMessage: '',

	createChannelLoadingStatus: NONE,
	createChannelLoadingStatusMessage: '',

	updateChannelLoadingStatus: NONE,
	updateChannelLoadingStatusMessage: '',

	deleteChannelLoadingStatus: NONE,
	deleteChannelLoadingStatusMessage: '',

	fetchOptionsLoadingStauts: NONE,
	fetchOptionsLoadingStautsMessage: '',
});

export default function channels(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_CHANNELS:
			return state.set('loadingStatus', LOADING);

		case FETCH_CHANNELS_SUCCESS: {
			const { data, nextPage, numOfItems, numOfPages } = action;

			return state
				.setIn(['data', 'channels'], List(data))
				.setIn(['data', 'page'], nextPage)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_CHANNELS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_CREATE_CHANNEL:
			return state.set('createChannelLoadingStatus', LOADING);

		case CREATE_CHANNEL_SUCCESS:
			return state.set('createChannelLoadingStatus', SUCCESS);

		case CREATE_CHANNEL_FAILED:
			return state
				.set('createChannelLoadingStatus', FAILED)
				.set('createChannelLoadingStatusMessage', action.errorMessage);

		case START_UPDATE_CHANNEL:
			return state.set('updateChannelLoadingStatus', LOADING);

		case UPDATE_CHANNEL_SUCCESS:
			return state.set('updateChannelLoadingStatus', SUCCESS);

		case UPDATE_CHANNEL_FAILED:
			return state
				.set('updateChannelLoadingStatus', FAILED)
				.set('updateChannelLoadingStatusMessage', action.errorMessage);

		case START_DELETE_CHANNEL:
			return state.set('deleteChannelLoadingStatus', LOADING);

		case DELETE_CHANNEL_SUCCESS:
			return state.set('deleteChannelLoadingStatus', SUCCESS);

		case DELETE_CHANNEL_FAILED:
			return state
				.set('deleteChannelLoadingStatus', FAILED)
				.set('deleteChannelLoadingStatusMessage', action.errorMessage);

		case START_FETCH_CHANNEL_OPTIONS:
			return state.set('fetchOptionsLoadingStauts', LOADING);

		case FETCH_CHANNEL_OPTIONS_SUCCESS: {
			const { channelOptions } = action;

			return state
				.set('channelOptions', List(channelOptions))
				.set('fetchOptionsLoadingStauts', SUCCESS);
		}

		case FETCH_CHANNEL_OPTIONS_FAILED:
			return state
				.set('fetchOptionsLoadingStauts', FAILED)
				.set('fetchOptionsLoadingStautsMessage', action.errorMessage);

		default:
			return state;
	}
}
