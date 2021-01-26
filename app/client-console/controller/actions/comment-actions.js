import {
	START_FETCH_COMMENTS,
	FETCH_COMMENTS_SUCCESS,
	FETCH_COMMENTS_FAILED,
	START_CREATE_COMMENT,
	CREATE_COMMENT_SUCCESS,
	CREATE_COMMENT_FAILED,
	RESET_COMMENTS,
} from './action-types';

export function fetchCommentsAction(channelId, orderId) {
	return {
		type: START_FETCH_COMMENTS,
		channelId,
		orderId,
	};
}

export function fetchCommentsSuccessAction(comments = []) {
	return {
		type: FETCH_COMMENTS_SUCCESS,
		comments,
	};
}

export function fetchCommentsFailedAction(error, errorMessage) {
	return {
		type: FETCH_COMMENTS_FAILED,
		error,
		errorMessage,
	};
}

export function createCommentAction(channelId, orderId, content) {
	return {
		type: START_CREATE_COMMENT,
		channelId,
		orderId,
		content,
	};
}

export function createCommentSuccessAction() {
	return {
		type: CREATE_COMMENT_SUCCESS,
	};
}

export function createCommentFailedAction(error, errorMessage) {
	return {
		type: CREATE_COMMENT_FAILED,
		error,
		errorMessage,
	};
}

export function resetCommentsAction() {
	return {
		type: RESET_COMMENTS,
	};
}
