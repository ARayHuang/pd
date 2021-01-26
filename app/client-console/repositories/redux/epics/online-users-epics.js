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
	onlineUsersAction,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';

const {
	START_FETCH_ONLINE_USERS,
} = actionTypes;
const {
	fetchOnlineUsersSuccessAction,
	fetchOnlineUsersFailedAction,
} = onlineUsersAction;
const {
	notifyErrorAction,
} = notifyActions;

export function fetchOnlinUsersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_ONLINE_USERS),
		switchMap(({ channelId } = {}) => rxjsApiFetcher
			.get('/users?isOnline=true', { queries: { channelId } })
			.pipe(
				map(({ response }) => fetchOnlineUsersSuccessAction(response)),
				catchError(error => catchErrorMessageForEpics(error, fetchOnlineUsersFailedAction, notifyErrorAction)),
			),
		),
	);
}
