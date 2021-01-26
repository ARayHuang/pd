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
	orderActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	START_FETCH_ORDERS,
} = actionTypes;
const {
	SKIP_NULL,
	SKIP_UNDEFINED,
	SKIP_NAN,
	SKIP_EMPTY_STRING,
} = objectFilterOptionEnums;
const options = [SKIP_NULL, SKIP_UNDEFINED, SKIP_NAN, SKIP_EMPTY_STRING];
const {
	fetchOrdersSuccessAction,
	fetchOrdersFailedAction,
} = orderActions;
const {
	notifyErrorAction,
} = notifyActions;

export function fetchOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_ORDERS),
		switchMap(({ queries }) => rxjsApiFetcher
			.get('/orders', { queries: objectFilter({ ...queries, limit: 10 }, options) })
			.pipe(
				map(payload => payload.response),
				map(({ data, numOfItems, numOfPages }) => fetchOrdersSuccessAction(data, numOfItems, numOfPages, queries.page)),
				catchError(error => catchErrorMessageForEpics(error, fetchOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}
