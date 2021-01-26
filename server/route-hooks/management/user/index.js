module.exports = {
	beforeGetUsersRequest: require('./get-users-request').before,
	beforeCreateManagerUserRequest: require('./create-manager-user-request').before,
	beforeCreateStaffUserRequest: require('./create-staff-user-request').before,
	beforeDeleteUserRequest: require('./delete-user-request').before,
	beforeGetUserRequest: require('./get-user-request').before,
	beforeUpdateManagerUserRequest: require('./update-manager-user-request').before,
	beforeUpdateStaffUserRequest: require('./update-staff-user-request').before,
};
