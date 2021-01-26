import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
	START_FETCH_ORDER,
	FETCH_ORDER_SUCCESS,
	FETCH_ORDER_FAILED,
	START_FETCH_ORDER_COMMENTS,
	FETCH_ORDER_COMMENTS_SUCCESS,
	FETCH_ORDER_COMMENTS_FAILED,
} = actionTypes;
const { NONE, LOADING, SUCCESS, FAILED } = LoadingStatusEnum;
const initialState = Map({
	data: Map({
		order: Map(),
		comments: List(),
		numOfItems: 0,
		numOfPages: 1,
	}),

	loadingStatus: NONE,
	loadingStatusMessage: '',

	commentsLoadingStatus: NONE,
	commentsLoadingStatusMessage: '',
});

export default function orderComments(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_ORDER:
			return state.set('loadingStatus', LOADING);

		case FETCH_ORDER_SUCCESS:
			return state
				.setIn(['data', 'order'], Map(action.order))
				.set('loadingStatus', SUCCESS);

		case FETCH_ORDER_FAILED:
			return state
				.set('loadingStatus', FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_FETCH_ORDER_COMMENTS:
			return state.set('commentsLoadingStatus', LOADING);

		case FETCH_ORDER_COMMENTS_SUCCESS: {
			const { comments, numOfItems, numOfPages } = action;

			return state
				.setIn(['data', 'comments'], List(comments))
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('commentsLoadingStatus', SUCCESS);
		}

		case FETCH_ORDER_COMMENTS_FAILED:
			return state
				.set('commentsLoadingStatus', FAILED)
				.set('commentsLoadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
