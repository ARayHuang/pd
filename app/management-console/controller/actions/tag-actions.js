import {
	START_FETCH_TAGS,
	FETCH_TAGS_SUCCESS,
	FETCH_TAGS_FAILED,
	START_CREATE_TAG,
	CREATE_TAG_SUCCESS,
	CREATE_TAG_FAILED,
	START_UPDATE_TAG,
	UPDATE_TAG_SUCCESS,
	UPDATE_TAG_FAILED,
	START_DELETE_TAG,
	DELETE_TAG_SUCCESS,
	DELETE_TAG_FAILED,
} from './action-types';

export function fetchTagsAction(queries = {}) {
	return {
		type: START_FETCH_TAGS,
		queries,
	};
}

export function fetchTagsSuccessAction(tags, numOfItems, numOfPages, page) {
	return {
		type: FETCH_TAGS_SUCCESS,
		tags,
		numOfItems,
		numOfPages,
		page,
	};
}

export function fetchTagsFailedAction(error, errorMessage) {
	return {
		type: FETCH_TAGS_FAILED,
		error,
		errorMessage,
	};
}

export function createTagAction(name, status, backgroundColor, fontColor) {
	return {
		type: START_CREATE_TAG,
		name,
		status,
		backgroundColor,
		fontColor,
	};
}

export function createTagSuccessAction(tag) {
	return {
		type: CREATE_TAG_SUCCESS,
		tag,
	};
}

export function createTagFailedAction(error, errorMessage) {
	return {
		type: CREATE_TAG_FAILED,
		error,
		errorMessage,
	};
}

export function updateTagAction(tagId, status) {
	return {
		type: START_UPDATE_TAG,
		tagId,
		status,
	};
}

export function updateTagSuccessAction(tagId, status) {
	return {
		type: UPDATE_TAG_SUCCESS,
		tagId,
		status,
	};
}

export function updateTagFailedAction(error, errorMessage) {
	return {
		type: UPDATE_TAG_FAILED,
		error,
		errorMessage,
	};
}

export function deleteTagAction(tagId) {
	return {
		type: START_DELETE_TAG,
		tagId,
	};
}

export function deleteTagSuccessAction(tagId) {
	return {
		type: DELETE_TAG_SUCCESS,
		tagId,
	};
}

export function deleteTagFailedAction(error, errorMessage) {
	return {
		type: DELETE_TAG_FAILED,
		error,
		errorMessage,
	};
}
