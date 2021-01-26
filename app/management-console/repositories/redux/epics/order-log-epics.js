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
	orderLogActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	START_FETCH_ORDER_LOGS,
} = actionTypes;
const {
	SKIP_NULL,
	SKIP_UNDEFINED,
	SKIP_NAN,
	SKIP_EMPTY_STRING,
} = objectFilterOptionEnums;
const options = [SKIP_NULL, SKIP_UNDEFINED, SKIP_NAN, SKIP_EMPTY_STRING];
const {
	fetchOrderLogsSuccessAction,
	fetchOrderLogsFailedAction,
} = orderLogActions;
const {
	notifyErrorAction,
} = notifyActions;

export function fetchOrderLogsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_ORDER_LOGS),
		switchMap(({ orderId, queries }) => rxjsApiFetcher
			.get(`/orders/id=${orderId}/logs`, { queries: objectFilter({ ...queries, limit: 500 }, options) })
			.pipe(
				map(payload => payload.response),
				map(({ data, numOfItems, numOfPages }) => fetchOrderLogsSuccessAction(data, numOfItems, numOfPages)),
				catchError(error => catchErrorMessageForEpics(error, fetchOrderLogsFailedAction, notifyErrorAction)),
			),
		),
	);
}
