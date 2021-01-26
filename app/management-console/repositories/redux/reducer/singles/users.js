import { Map, List } from 'immutable';
import { LoadingStatusEnum } from '../../../../../lib/enums';
import { actionTypes } from '../../../../controller';

const {
	START_FETCH_SINGLE_USER,
	FETCH_SINGLE_USER_SUCCESS,
	FETCH_SINGLE_USER_FAILED,
	START_FETCH_USERS,
	FETCH_USERS_SUCCESS,
	FETCH_USERS_FAILED,
	START_CREATE_MANAGER,
	CREATE_MANAGER_SUCCESS,
	CREATE_MANAGER_FAILED,
	START_CREATE_STAFF,
	CREATE_STAFF_SUCCESS,
	CREATE_STAFF_FAILED,
	START_UPDATE_MANAGER,
	UPDATE_MANAGER_SUCCESS,
	UPDATE_MANAGER_FAILED,
	START_UPDATE_STAFF,
	UPDATE_STAFF_SUCCESS,
	UPDATE_STAFF_FAILED,
	START_DELETE_USER,
	DELETE_USER_SUCCESS,
	DELETE_USER_FAILED,
} = actionTypes;
const initialState = Map({
	data: Map({
		users: List(),
		page: 1,
		numOfItems: 0,
		numOfPages: 1,
	}),
	loadingStatus: LoadingStatusEnum.NONE,
	loadingStatusMessage: '',
	fetchSingleUserLoadingStatus: LoadingStatusEnum.NONE,
	fetchSingleUserLoadingStatusMessage: '',

	createManagerLoadingStatus: LoadingStatusEnum.NONE,
	createManagerLoadingStatusMessage: '',

	createStaffLoadingStatus: LoadingStatusEnum.NONE,
	createStaffLoadingStatusMessage: '',

	updateManagerLoadingStatus: LoadingStatusEnum.NONE,
	updateManagerLoadingStatusMessage: '',

	updateStaffLoadingStatus: LoadingStatusEnum.NONE,
	updateStaffLoadingStatusMessage: '',

	deleteUserLoadingStatus: LoadingStatusEnum.NONE,
	deleteUserLoadingStatusMessage: '',
});

export default function users(state = initialState, action) {
	switch (action.type) {
		case START_FETCH_SINGLE_USER:
			return state.set('fetchSingleUserLoadingStatus', LoadingStatusEnum.LOADING);

		case FETCH_SINGLE_USER_SUCCESS: {
			const nextUsers = state.getIn(['data', 'users']).map(user => {
				if (user.id === action.user.id) {
					return action.user;
				}

				return user;
			});

			return state
				.setIn(['data', 'users'], nextUsers)
				.set('fetchSingleUserLoadingStatus', LoadingStatusEnum.SUCCESS);
		}

		case FETCH_SINGLE_USER_FAILED:
			return state
				.set('fetchSingleUserLoadingStatus', LoadingStatusEnum.FAILED)
				.set('fetchSingleUserLoadingStatusMessage', action.errorMessage);

		case START_FETCH_USERS:
			return state.set('loadingStatus', LoadingStatusEnum.LOADING);

		case FETCH_USERS_SUCCESS: {
			const { data, nextPage, numOfItems, numOfPages } = action;

			return state
				.setIn(['data', 'users'], List(data))
				.setIn(['data', 'page'], nextPage)
				.setIn(['data', 'numOfItems'], numOfItems)
				.setIn(['data', 'numOfPages'], numOfPages)
				.set('loadingStatus', LoadingStatusEnum.SUCCESS);
		}

		case FETCH_USERS_FAILED:
			return state
				.set('loadingStatus', LoadingStatusEnum.FAILED)
				.set('loadingStatusMessage', action.errorMessage);

		case START_CREATE_MANAGER:
			return state.set('createManagerLoadingStatus', LoadingStatusEnum.LOADING);

		case CREATE_MANAGER_SUCCESS:
			return state.set('createManagerLoadingStatus', LoadingStatusEnum.SUCCESS);

		case CREATE_MANAGER_FAILED:
			return state
				.set('createManagerLoadingStatus', LoadingStatusEnum.FAILED)
				.set('createManagerLoadingStatusMessage', action.errorMessage);

		case START_CREATE_STAFF:
			return state.set('createStaffLoadingStatus', LoadingStatusEnum.LOADING);

		case CREATE_STAFF_SUCCESS:
			return state.set('createStaffLoadingStatus', LoadingStatusEnum.SUCCESS);

		case CREATE_STAFF_FAILED:
			return state
				.set('createStaffLoadingStatus', LoadingStatusEnum.FAILED)
				.set('createStaffLoadingStatusMessage', action.errorMessage);

		case START_UPDATE_MANAGER:
			return state.set('updateManagerLoadingStatus', LoadingStatusEnum.LOADING);

		case UPDATE_MANAGER_SUCCESS:
			return state.set('updateManagerLoadingStatus', LoadingStatusEnum.SUCCESS);

		case UPDATE_MANAGER_FAILED:
			return state
				.set('updateManagerLoadingStatus', LoadingStatusEnum.FAILED)
				.set('updateManagerLoadingStatusMessage', action.errorMessage);

		case START_UPDATE_STAFF:
			return state.set('updateStaffLoadingStatus', LoadingStatusEnum.LOADING);

		case UPDATE_STAFF_SUCCESS:
			return state.set('updateStaffLoadingStatus', LoadingStatusEnum.SUCCESS);

		case UPDATE_STAFF_FAILED:
			return state
				.set('updateStaffLoadingStatus', LoadingStatusEnum.FAILED)
				.set('updateStaffLoadingStatusMessage', action.errorMessage);

		case START_DELETE_USER:
			return state.set('deleteUserLoadingStatus', LoadingStatusEnum.LOADING);

		case DELETE_USER_SUCCESS:
			return state.set('deleteUserLoadingStatus', LoadingStatusEnum.SUCCESS);

		case DELETE_USER_FAILED:
			return state
				.set('deleteUserLoadingStatus', LoadingStatusEnum.FAILED)
				.set('deleteUserLoadingStatusMessage', action.errorMessage);

		default:
			return state;
	}
}
