import {
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
} from './action-types';

export function fetchUsersAction(userType, departmentType,
	{
		hasPermissionToAddStaff,
		shiftType,
		channelId,
		displayName,
		channelName,
		username,
		sort,
		order,
		limit,
		page,
	} = {}) {
	return {
		type: START_FETCH_USERS,
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
			limit,
			page,
		},
	};
}

export function fetchUsersSuccessAction({
	data,
	nextPage,
	numOfItems,
	numOfPages,
}) {
	return {
		type: FETCH_USERS_SUCCESS,
		data,
		nextPage,
		numOfItems,
		numOfPages,
	};
}

export function fetchUsersFailedAction(error, errorMessage) {
	return {
		type: FETCH_USERS_FAILED,
		error,
		errorMessage,
	};
}

export function createManagerAction({
	profilePictureId,
	displayName,
	password,
	username,
	departmentType,
	hasPermissionToAddStaff,
}) {
	return {
		type: START_CREATE_MANAGER,
		data: {
			profilePictureId,
			displayName,
			password,
			username,
			departmentType,
			hasPermissionToAddStaff,
		},
	};
}

export function createManagerSuccessAction() {
	return {
		type: CREATE_MANAGER_SUCCESS,
	};
}

export function createManagerFailedAction(error, errorMessage) {
	return {
		type: CREATE_MANAGER_FAILED,
		error,
		errorMessage,
	};
}

export function createStaffAction({
	profilePictureId,
	shiftType,
	channelIds,
	displayName,
	password,
	username,
}) {
	return {
		type: START_CREATE_STAFF,
		data: {
			profilePictureId,
			shiftType,
			channelIds,
			displayName,
			password,
			username,
		},
	};
}

export function createStaffSuccessAction() {
	return {
		type: CREATE_STAFF_SUCCESS,
	};
}

export function createStaffFailedAction(error, errorMessage) {
	return {
		type: CREATE_STAFF_FAILED,
		error,
		errorMessage,
	};
}

export function updateManagerAction(id, {
	profilePictureId,
	displayName,
	password,
	hasPermissionToAddStaff,
}) {
	return {
		type: START_UPDATE_MANAGER,
		id,
		data: {
			profilePictureId,
			displayName,
			password,
			hasPermissionToAddStaff,
		},
	};
}

export function updateManagerSuccessAction() {
	return {
		type: UPDATE_MANAGER_SUCCESS,
	};
}

export function updateManagerFailedAction(error, errorMessage) {
	return {
		type: UPDATE_MANAGER_FAILED,
		error,
		errorMessage,
	};
}

export function updateStaffAction(id, {
	profilePictureId,
	displayName,
	password,
	shiftType,
	channelIds,
}) {
	return {
		type: START_UPDATE_STAFF,
		id,
		data: {
			profilePictureId,
			displayName,
			password,
			shiftType,
			channelIds,
		},
	};
}

export function updateStaffSuccessAction() {
	return {
		type: UPDATE_STAFF_SUCCESS,
	};
}

export function updateStaffFailedAction(error, errorMessage) {
	return {
		type: UPDATE_STAFF_FAILED,
		error,
		errorMessage,
	};
}

export function deleteUserAction(id) {
	return {
		type: START_DELETE_USER,
		id,
	};
}

export function deleteUserSuccessAction() {
	return {
		type: DELETE_USER_SUCCESS,
	};
}

export function deleteUserFailedAction(error, errorMessage) {
	return {
		type: DELETE_USER_FAILED,
		error,
		errorMessage,
	};
}
