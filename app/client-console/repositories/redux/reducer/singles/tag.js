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
	START_FETCH_TAGS,
	FETCH_TAGS_SUCCESS,
	FETCH_TAGS_FAILED,
	UPDATE_TAGS,
} = actionTypes;
const initialState = Map({
	data: List(),

	loadingStatus: NONE,
	loadingStatusMessage: '',
});

export default function tag(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_TAGS:
			return state
				.set('loadingStatus', LOADING);

		case FETCH_TAGS_SUCCESS:
			return state
				.set('data', List(action.tags))
				.set('loadingStatus', SUCCESS);

		case FETCH_TAGS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case UPDATE_TAGS:
			return state
				.set('data', List(action.tags));

		default:
			return state;
	}
}
