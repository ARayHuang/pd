import { ofType } from 'redux-observable';
import {
	switchMap,
	map,
	catchError,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	commentsActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';

const {
	START_FETCH_COMMENTS,
	START_CREATE_COMMENT,
} = actionTypes;
const {
	fetchCommentsSuccessAction,
	fetchCommentsFailedAction,
	createCommentSuccessAction,
	createCommentFailedAction,
} = commentsActions;
const {
	notifyErrorAction,
} = notifyActions;

export function fetchCommentsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_COMMENTS),
		switchMap(({ channelId, orderId } = {}) => rxjsApiFetcher
			.get(`/channels/id=${channelId}/orders/id=${orderId}/comments`)
			.pipe(
				map(payload => fetchCommentsSuccessAction(payload.response)),
				catchError(error => catchErrorMessageForEpics(error, fetchCommentsFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createCommentEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_COMMENT),
		switchMap(({ channelId, orderId, content } = {}) => rxjsApiFetcher
			.post(`/channels/id=${channelId}/orders/id=${orderId}/comments`, { content })
			.pipe(
				map(() => createCommentSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, createCommentFailedAction, notifyErrorAction)),
			),
		),
	);
}
