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
	createdOrdersActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { OrderStatusEnums } from '../../../lib/enums';

const {
	START_FETCH_CREATED_ORDERS,
	START_FETCH_NEXT_CREATED_ORDERS,
} = actionTypes;
const {
	fetchCreatedOrdersSuccessAction,
	fetchCreatedOrdersFailedAction,
	fetchNextCreatedOrdersSuccessAction,
	fetchNextCreatedOrdersFailedAction,
} = createdOrdersActions;
const {
	notifyErrorAction,
} = notifyActions;
const { CREATED } = OrderStatusEnums;
const order = 'asc';

export function fetchCreatedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CREATED_ORDERS),
		switchMap(() => rxjsApiFetcher.get('/orders', { queries: { status: CREATED, order } })
			.pipe(
				map(({ response }) => fetchCreatedOrdersSuccessAction(response)),
				catchError(error => catchErrorMessageForEpics(error, fetchCreatedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchNextCreatedOrdersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_NEXT_CREATED_ORDERS),
		switchMap(({ page }) => rxjsApiFetcher.get('/orders', { queries: { status: CREATED, page, order } })
			.pipe(
				map(({ response }) => fetchNextCreatedOrdersSuccessAction(page, response)),
				catchError(error => catchErrorMessageForEpics(error, fetchNextCreatedOrdersFailedAction, notifyErrorAction)),
			),
		),
	);
}
