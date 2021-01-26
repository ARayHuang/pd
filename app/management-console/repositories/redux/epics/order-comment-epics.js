import { ofType } from 'redux-observable';
import {
	switchMap,
	catchError,
	map,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	orderCommentActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	START_FETCH_ORDER,
	START_FETCH_ORDER_COMMENTS,
} = actionTypes;
const {
	SKIP_NULL,
	SKIP_UNDEFINED,
	SKIP_NAN,
	SKIP_EMPTY_STRING,
} = objectFilterOptionEnums;
const options = [SKIP_NULL, SKIP_UNDEFINED, SKIP_NAN, SKIP_EMPTY_STRING];
const {
	fetchOrderSuccessAction,
	fetchOrderFailedAction,
	fetchOrderCommentsSuccessAction,
	fetchOrderCommentsFailedAction,
} = orderCommentActions;
const {
	notifyErrorAction,
} = notifyActions;

export function fetchOrderEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_ORDER),
		switchMap(({ orderId }) => rxjsApiFetcher
			.get(`/orders/id=${orderId}`)
			.pipe(
				map(payload => payload.response),
				map(order => fetchOrderSuccessAction(order)),
				catchError(error => catchErrorMessageForEpics(error, fetchOrderFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchOrderCommentsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_ORDER_COMMENTS),
		switchMap(({ orderId, queries }) => rxjsApiFetcher
			.get(`/orders/id=${orderId}/comments`, { queries: objectFilter({ ...queries, limit: 500 }, options) })
			.pipe(
				map(payload => payload.response),
				map(({ data, numOfItems, numOfPages }) => fetchOrderCommentsSuccessAction(data, numOfItems, numOfPages)),
				catchError(error => catchErrorMessageForEpics(error, fetchOrderCommentsFailedAction, notifyErrorAction)),
			),
		),
	);
}
