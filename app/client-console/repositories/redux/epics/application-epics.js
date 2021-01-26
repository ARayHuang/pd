import { ofType } from 'redux-observable';
import { zip } from 'rxjs';
import {
	switchMap,
	mergeMap,
	catchError,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	applicationActions,
	orderActions,
	createdOrdersActions,
	consumerOrderActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { OrderStatusEnums } from '../../../lib/enums';

const {
	START_INITIALIZE_CONSUMER_APPLICATION,
	START_INITIALIZE_PROVIDER_APPLICATION,
} = actionTypes;
const {
	initializeConsumerApplicationSuccessAction,
	initializeConsumerApplicationFailedAction,
	initializeProviderApplicationSuccessAction,
	initializeProviderApplicationFailedAction,
} = applicationActions;
const {
	fetchCreatedOrdersSuccessAction,
} = createdOrdersActions;
const {
	setConsumerTrackedNumOfItemsAction,
} = consumerOrderActions;
const {
	setTrackedNumOfItemsAction,
} = orderActions;
const {
	notifyErrorAction,
} = notifyActions;
const {
	CREATED,
	TRACKED,
} = OrderStatusEnums;

export function initializeConsumerApplicationEpic(action$) {
	return action$.pipe(
		ofType(START_INITIALIZE_CONSUMER_APPLICATION),
		switchMap(() =>
			zip(
				rxjsApiFetcher.get('/orders', { queries: { status: CREATED, order: 'asc' } }),
				rxjsApiFetcher.get('/orders', { queries: { status: TRACKED } }),
			).pipe(
				mergeMap(payloads => {
					const [
						{ response: createdOrdersResponse = {} },
						{ response: trackedOrdersResponse = {} },
					] = payloads;

					return [
						fetchCreatedOrdersSuccessAction(createdOrdersResponse),
						setConsumerTrackedNumOfItemsAction(trackedOrdersResponse.numOfItems),
						initializeConsumerApplicationSuccessAction(),
					];
				}),
				catchError(error => catchErrorMessageForEpics(error, initializeConsumerApplicationFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function initializeProviderApplicationEpic(action$, state$) {
	return action$.pipe(
		ofType(START_INITIALIZE_PROVIDER_APPLICATION),
		switchMap(() => {
			const channel = state$.value.channel.get('data').toObject();
			const selectedChannel = channel.id ? channel : state$.value.auth.getIn(['me', 'channels'])[0];
			const { id } = selectedChannel;
			const URI = `/channels/id=${id}/orders`;

			return zip(
				rxjsApiFetcher.get(URI, { queries: { status: TRACKED } }),
			).pipe(
				mergeMap(payloads => {
					const [
						{ response: trackedOrdersResponse = {} },
					] = payloads;

					return [
						setTrackedNumOfItemsAction(trackedOrdersResponse.numOfItems),
						initializeProviderApplicationSuccessAction(),
					];
				}),
				catchError(error => catchErrorMessageForEpics(error, initializeProviderApplicationFailedAction, notifyErrorAction)),
			);
		}),
	);
}
