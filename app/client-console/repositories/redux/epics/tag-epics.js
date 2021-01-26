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
	tagActions,
	notifyActions,
} from '../../../controller';
import {
	rxjsApiFetcher,
} from '../../../lib/general-utils';

const {
	START_FETCH_TAGS,
} = actionTypes;
const {
	fetchTagsSuccessAction,
	fetchTagsFailedAction,
} = tagActions;
const { notifyErrorAction } = notifyActions;

export function fetchTagsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_TAGS),
		switchMap(() => rxjsApiFetcher
			.get('/tags')
			.pipe(
				map(payload => fetchTagsSuccessAction(payload.response)),
				catchError(error => catchErrorMessageForEpics(error, fetchTagsFailedAction, notifyErrorAction)),
			),
		),
	);
}
