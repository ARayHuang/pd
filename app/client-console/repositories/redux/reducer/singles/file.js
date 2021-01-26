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
	START_UPLOAD_FILE,
	UPLOAD_FILE_SUCCESS,
	UPLOAD_FILE_FAILED,
} = actionTypes;
const initialState = Map({
	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function file(state = initialState, action) {
	switch (action.type) {
		case START_UPLOAD_FILE:
			return state.set('loadingStatus', LOADING);

		case UPLOAD_FILE_SUCCESS:
			return state.set('loadingStatus', SUCCESS);

		case UPLOAD_FILE_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
