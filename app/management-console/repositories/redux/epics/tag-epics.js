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
	tagActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	START_FETCH_TAGS,
	START_CREATE_TAG,
	START_UPDATE_TAG,
	START_DELETE_TAG,
} = actionTypes;
const {
	SKIP_NULL,
	SKIP_UNDEFINED,
	SKIP_NAN,
	SKIP_EMPTY_STRING,
} = objectFilterOptionEnums;
const options = [SKIP_NULL, SKIP_UNDEFINED, SKIP_NAN, SKIP_EMPTY_STRING];
const {
	fetchTagsSuccessAction,
	fetchTagsFailedAction,
	createTagSuccessAction,
	createTagFailedAction,
	updateTagSuccessAction,
	updateTagFailedAction,
	deleteTagSuccessAction,
	deleteTagFailedAction,
} = tagActions;
const {
	notifyErrorAction,
	notifySuccessAction,
} = notifyActions;

export function fetchTagsEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_TAGS),
		switchMap(({ queries }) => rxjsApiFetcher
			.get('/tags', { queries: objectFilter(queries, options) })
			.pipe(
				map(payload => payload.response),
				map(({ data, numOfItems, numOfPages }) => fetchTagsSuccessAction(data, numOfItems, numOfPages, queries.page)),
				catchError(error => catchErrorMessageForEpics(error, fetchTagsFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createTagEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_TAG),
		switchMap(({ name, status, backgroundColor, fontColor }) => rxjsApiFetcher
			.post('/tags', { name, status, backgroundColor, fontColor })
			.pipe(
				map(payload => payload.response),
				mergeMap(tag => [
					createTagSuccessAction(tag),
					notifySuccessAction('新增标签成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, createTagFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateTagEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_TAG),
		switchMap(({ tagId, status }) => rxjsApiFetcher
			.put(`/tags/id=${tagId}`, { status })
			.pipe(
				mergeMap(() => [
					updateTagSuccessAction(tagId, status),
					notifySuccessAction('更新标签成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, updateTagFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function deleteTagEpic(action$) {
	return action$.pipe(
		ofType(START_DELETE_TAG),
		switchMap(({ tagId }) => rxjsApiFetcher
			.delete(`/tags/id=${tagId}`)
			.pipe(
				mergeMap(() => [
					deleteTagSuccessAction(tagId),
					notifySuccessAction('删除标签成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, deleteTagFailedAction, notifyErrorAction)),
			),
		),
	);
}
