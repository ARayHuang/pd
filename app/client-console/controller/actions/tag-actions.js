import {
	START_FETCH_TAGS,
	FETCH_TAGS_SUCCESS,
	FETCH_TAGS_FAILED,

	UPDATE_TAGS,
} from './action-types';

export function fetchTagsAction() {
	return {
		type: START_FETCH_TAGS,
	};
}

export function fetchTagsSuccessAction(tags) {
	return {
		type: FETCH_TAGS_SUCCESS,
		tags,
	};
}

export function fetchTagsFailedAction(error, errorMessage) {
	return {
		type: FETCH_TAGS_FAILED,
		error,
		errorMessage,
	};
}

export function updateTagsAction(tags) {
	return {
		type: UPDATE_TAGS,
		tags,
	};
}
