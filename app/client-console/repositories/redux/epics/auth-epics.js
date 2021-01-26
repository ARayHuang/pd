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
	authActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';

const {
	START_CHECK_AUTH,
	START_LOGIN,
	START_LOGOUT,
	START_UPDATE_CHANNEL_SETTINGS,
} = actionTypes;
const {
	checkAuthSuccessAction,
	checkAuthFailedAction,
	loginSuccessAction,
	loginFailedAction,
	logoutSuccessAction,
	logoutFailedAction,
	updateChannelSettingsSuccessAction,
	updateChannelSettingsFailedAction,
} = authActions;
const {
	notifyErrorAction,
} = notifyActions;

export function checkAuthEpic(action$) {
	return action$.pipe(
		ofType(START_CHECK_AUTH),
		switchMap(() => rxjsApiFetcher
			.get('/users/id=me')
			.pipe(
				map(payload => checkAuthSuccessAction(payload.response)),
				catchError(error => catchErrorMessageForEpics(error, checkAuthFailedAction)),
			),
		),
	);
}

export function loginEpic(action$) {
	return action$.pipe(
		ofType(START_LOGIN),
		switchMap(action => rxjsApiFetcher
			.post('/login',
				{
					username: action.username,
					password: action.password,
				})
			.pipe(
				map(() => loginSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, loginFailedAction)),
			),
		),
	);
}

export function logoutEpic(action$) {
	return action$.pipe(
		ofType(START_LOGOUT),
		switchMap(() => rxjsApiFetcher
			.post('/logout')
			.pipe(
				map(() => logoutSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, logoutFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateChannelSettingsEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_CHANNEL_SETTINGS),
		switchMap(({ channelSettings }) => rxjsApiFetcher
			.put('/users/id=me/channel-settings', channelSettings)
			.pipe(
				map(() => updateChannelSettingsSuccessAction(channelSettings)),
				catchError(error => catchErrorMessageForEpics(error, updateChannelSettingsFailedAction, notifyErrorAction)),
			),
		),
	);
}
