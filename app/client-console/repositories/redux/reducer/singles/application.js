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
	START_INITIALIZE_CONSUMER_APPLICATION,
	INITIALIZE_CONSUMER_APPLICATION_SUCCESS,
	INITIALIZE_CONSUMER_APPLICATION_FAILED,
	START_INITIALIZE_PROVIDER_APPLICATION,
	INITIALIZE_PROVIDER_APPLICATION_SUCCESS,
	INITIALIZE_PROVIDER_APPLICATION_FAILED,
} = actionTypes;
const initialState = Map({
	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function application(state = initialState, action) {
	switch (action.type) {
		case START_INITIALIZE_CONSUMER_APPLICATION:
		case START_INITIALIZE_PROVIDER_APPLICATION:
			return state.set('loadingStatus', LOADING);
		case INITIALIZE_CONSUMER_APPLICATION_SUCCESS:
		case INITIALIZE_PROVIDER_APPLICATION_SUCCESS:
			return state.set('loadingStatus', SUCCESS);
		case INITIALIZE_CONSUMER_APPLICATION_FAILED:
		case INITIALIZE_PROVIDER_APPLICATION_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);
		default:
			return state;
	}
}
