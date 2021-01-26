import { ofType } from 'redux-observable';
import {
	switchMap,
	map,
	catchError,
	mergeMap,
} from 'rxjs/operators';
import { catchErrorMessageForEpics } from '../../../../lib/epic-utils';
import {
	actionTypes,
	userActions,
	notifyActions,
} from '../../../controller';
import { rxjsApiFetcher } from '../../../lib/general-utils';
import { objectFilter, objectFilterOptionEnums } from '../../../../lib/object-utils';

const {
	START_FETCH_USERS,
	START_CREATE_MANAGER,
	START_CREATE_STAFF,
	START_UPDATE_MANAGER,
	START_UPDATE_STAFF,
	START_DELETE_USER,
} = actionTypes;
const {
	fetchUsersSuccessAction,
	fetchUsersFailedAction,
	createManagerSuccessAction,
	createManagerFailedAction,
	createStaffSuccessAction,
	createStaffFailedAction,
	updateManagerSuccessAction,
	updateManagerFailedAction,
	updateStaffSuccessAction,
	updateStaffFailedAction,
	deleteUserSuccessAction,
	deleteUserFailedAction,
} = userActions;
const {
	SKIP_EMPTY_STRING,
	SKIP_UNDEFINED,
	SKIP_NULL,
} = objectFilterOptionEnums;
const options = [SKIP_EMPTY_STRING, SKIP_UNDEFINED, SKIP_NULL];
const PAGE_LIMIT = 10;
const {
	notifyErrorAction,
	notifySuccessAction,
} = notifyActions;

export function fetchUsersEpic(action$) {
	return action$.pipe(
		ofType(START_FETCH_USERS),
		switchMap(({
			userType,
			departmentType,
			tableQueries: {
				hasPermissionToAddStaff,
				shiftType,
				channelId,
				displayName,
				channelName,
				username,
				sort,
				order,
				limit = PAGE_LIMIT,
				page,
			},
		} = {}) => rxjsApiFetcher
			.get('users', { queries: objectFilter({
				hasPermissionToAddStaff,
				type: userType,
				departmentType,
				shiftType,
				channelId,
				displayName,
				channelName,
				username,
				sort,
				order,
				limit,
				page,
			}, options) })
			.pipe(
				map(payload => {
					const param = {
						nextPage: page,
						...payload.response,
					};

					return fetchUsersSuccessAction(param);
				}),
				catchError(error => catchErrorMessageForEpics(error, fetchUsersFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createManagerEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_MANAGER),
		switchMap(action => rxjsApiFetcher
			.post('users?via=admin', {
				...action.data,
			})
			.pipe(
				mergeMap(() => [
					createManagerSuccessAction(),
					notifySuccessAction('新增帐号成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, createManagerFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function createStaffEpic(action$) {
	return action$.pipe(
		ofType(START_CREATE_STAFF),
		switchMap(action => rxjsApiFetcher
			.post('users?via=manager', {
				...action.data,
			})
			.pipe(
				mergeMap(() => [
					createStaffSuccessAction(),
					notifySuccessAction('新增帐号成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, createStaffFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateManagerEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_MANAGER),
		switchMap(action => rxjsApiFetcher
			.patch(`users/id=${action.id}?via=admin`, {
				...action.data,
			})
			.pipe(
				mergeMap(() => [
					updateManagerSuccessAction(),
					notifySuccessAction('更新帐号成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, updateManagerFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function updateStaffEpic(action$) {
	return action$.pipe(
		ofType(START_UPDATE_STAFF),
		switchMap(action => rxjsApiFetcher
			.patch(`users/id=${action.id}?via=manager`, {
				...action.data,
			})
			.pipe(
				mergeMap(() => [
					updateStaffSuccessAction(),
					notifySuccessAction('更新帐号成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, updateStaffFailedAction, notifyErrorAction)),
			),
		),
	);
}

export function deleteUserEpic(action$) {
	return action$.pipe(
		ofType(START_DELETE_USER),
		switchMap(action => rxjsApiFetcher
			.delete(`users/id=${action.id}`)
			.pipe(
				mergeMap(() => [
					deleteUserSuccessAction(),
					notifySuccessAction('删除帐号成功'),
				]),
				catchError(error => catchErrorMessageForEpics(error, deleteUserFailedAction, notifyErrorAction)),
			),
		),
	);
}
