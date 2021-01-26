const express = require('express');
const router = new express.Router();
const {
	beforeGetUsersRequest,
	beforeCreateManagerUserRequest,
	beforeCreateStaffUserRequest,
	beforeDeleteUserRequest,
	beforeGetUserRequest,
	beforeUpdateManagerUserRequest,
	beforeUpdateStaffUserRequest,
} = require('../../route-hooks/management/user/index');
const {
	handleGetUsersRequest,
	handleGetMeRequest,
	handleCreateManagerUserRequest,
	handleCreateStaffUserRequest,
	handleDeleteUserRequest,
	handleGetUserRequest,
	handleUpdateManagerUserRequest,
	handleUpdateStaffUserRequest,
} = require('../../route-handlers/management/user/index');

router.get(
	'/id=me',
	handleGetMeRequest,
);

router.post(
	'/',
	beforeCreateManagerUserRequest,
	handleCreateManagerUserRequest,
);

router.post(
	'/',
	beforeCreateStaffUserRequest,
	handleCreateStaffUserRequest,
);

router.get(
	'/',
	beforeGetUsersRequest,
	handleGetUsersRequest,
);

router.delete(
	'/id=:userId',
	beforeDeleteUserRequest,
	handleDeleteUserRequest,
);

router.get(
	'/id=:userId',
	beforeGetUserRequest,
	handleGetUserRequest,
);

router.patch(
	'/id=:userId',
	beforeUpdateManagerUserRequest,
	handleUpdateManagerUserRequest,
);

router.patch(
	'/id=:userId',
	beforeUpdateStaffUserRequest,
	handleUpdateStaffUserRequest,
);

module.exports = router;
