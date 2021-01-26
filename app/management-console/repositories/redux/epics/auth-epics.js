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
	authActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';

const {
	START_LOGIN,
	START_CHECK_AUTH,
	START_LOGOUT,
} = actionTypes;
const {
	loginSuccessAction,
	loginFailedAction,
	checkAuthSuccessAction,
	checkAuthFailedAction,
	logoutSuccessAction,
	logoutFailedAction,
} = authActions;
const {
	notifyErrorAction,
} = notifyActions;

export function loginEpic(action$) {
	return action$.pipe(
		ofType(START_LOGIN),
		switchMap(action => rxjsApiFetcher
			.post('/login',
				{
					username: action.username,
					password: action.password,
				}).pipe(
				map(() => loginSuccessAction()),
				catchError(error => catchErrorMessageForEpics(error, loginFailedAction)),
			),
		),
	);
}

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
