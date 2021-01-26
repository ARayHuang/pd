import { Map, List } from 'immutable';
import { actionTypes } from '../../../../controller';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { isDateValid, convertDateStringToTimestamp } from '../../../../../lib/moment-utils';

const {
	NONE,
	LOADING,
	SUCCESS,
	FAILED,
} = LoadingStatusEnum;
const {
	START_FETCH_COMMENTS,
	FETCH_COMMENTS_SUCCESS,
	FETCH_COMMENTS_FAILED,
	START_CREATE_COMMENT,
	CREATE_COMMENT_SUCCESS,
	CREATE_COMMENT_FAILED,
	RESET_COMMENTS,
	APPEND_ORDER_COMMENT,
} = actionTypes;
const initialState = Map({
	data: List(),

	loadingStatus: NONE,
	loadingStatusMessage: '',

	createCommentLoadingStatus: NONE,
	createCommentLoadingStatusMessage: '',
});

export default function comment(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_COMMENTS:
			return state.set('loadingStatus', LOADING);

		case FETCH_COMMENTS_SUCCESS: {
			const { comments = [] } = action;

			return state
				.set('data', List(sortedComments(comments)))
				.set('loadingStatus', SUCCESS);
		}

		case FETCH_COMMENTS_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_CREATE_COMMENT:
			return state.set('createCommentLoadingStatus', LOADING);

		case CREATE_COMMENT_SUCCESS:
			return state.set('createCommentLoadingStatus', SUCCESS);

		case CREATE_COMMENT_FAILED:
			return state
				.set('createCommentLoadingStatus', FAILED)
				.set('createCommentLoadingStatusMessage', action.errorMessage);

		case RESET_COMMENTS:
			return state.set('data', List());

		case APPEND_ORDER_COMMENT:
			return state.updateIn(['data'], comments => new List([...comments, action.orderComment]));

		default:
			return state;
	}
}

function sortedComments(comments = []) {
	if (comments) {
		return comments
			.sort(({ createdAt: prev }, { createdAt: next }) => {
				if (isDateValid(prev) && isDateValid(next)) {
					return convertDateStringToTimestamp(prev) - convertDateStringToTimestamp(next);
				}

				return false;
			});
	}

	return [];
}
