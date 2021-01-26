import { ofType } from 'redux-observable';
import {
	switchMap,
	catchError,
	map,
	mergeMap,
} from 'rxjs/operators';
import {
	catchErrorMessageForEpics,
} from '../../../../lib/epic-utils';
import {
	actionTypes,
	channelActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	SKIP_EMPTY_STRING,
	SKIP_UNDEFINED,
	SKIP_NULL,
} = objectFilterOptionEnums;
const options = [SKIP_EMPTY_STRING, SKIP_UNDEFINED, SKIP_NULL];
const {
	START_FETCH_CHANNELS,
	START_CREATE_CHANNEL,
	START_UPDATE_CHANNEL,
	START_DELETE_CHANNEL,
	START_FETCH_CHANNEL_OPTIONS,
} = actionTypes;
const PAGE_LIMIT = 10;
const {
	fetchChannelsSuccessAction,
	fetchChannelsFailedAction,
	createChannelSuccessAction,
	createChannelFailedAction,
	updateChannelSuccessAction,
	updateChannelFailedAction,
	deleteChannelSuccessAction,
	deleteChannelFailedAction,
	fetchChannelOptionsSuccessAction,
	fetchChannelOptionsFailedAction,
} = channelActions;
const {
	notifyErrorAction,
	notifySuccessAction,
} = notifyActions;

export function fetchChannelsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CHANNELS),
		switchMap(({ limit = PAGE_LIMIT, page = 1, sort, order } = {}) => rxjsApiFetcher
			.get('channels', {
				queries: objectFilter({
					limit,
					page,
					sort,
					order,
				}, options),
			})
			.pipe(
				map(payload => {
					const param = {
						nextPage: page,
						...payload.response,
					};

					return fetchChannelsSuccessAction(param);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchChannelsFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createChannelEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_CHANNEL),
		switchMap(action => rxjsApiFetcher
			.post('channels', {
				name: action.name,
			})
			.pipe(
				mergeMap(() => [
					createChannelSuccessAction(),
					notifySuccessAction('新增频道成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, createChannelFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateChannelEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_CHANNEL),
		switchMap(action => rxjsApiFetcher
			.put(`channels/id=${action.channelId}`, {
				name: action.name,
			})
			.pipe(
				mergeMap(() => [
					updateChannelSuccessAction(),
					notifySuccessAction('更新频道成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, updateChannelFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function deleteChannelEpic(action$) {
	return action$.pipe(
		ofType(START_DELETE_CHANNEL),
		switchMap(action => rxjsApiFetcher
			.delete(`channels/id=${action.channelId}`)
			.pipe(
				map(() => deleteChannelSuccessAction()),
				mergeMap(() => [
					deleteChannelSuccessAction(),
					notifySuccessAction('删除频道成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, deleteChannelFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function fetchChannelOptionsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_CHANNEL_OPTIONS),
		switchMap(() => rxjsApiFetcher
			.get('channels', { queries: { limit: 50 } })
			.pipe(
				map(payload => payload.response),
				map(({ data }) => {
					const channelOptions = data.map(channel => {
						return {
							label: channel.name,
							value: channel.id,
						};
					});

					return fetchChannelOptionsSuccessAction(channelOptions);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchChannelOptionsFailedAction, notifyErrorAction)),
			),
		),
	);
}
