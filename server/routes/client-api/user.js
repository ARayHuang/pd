const express = require('express');
const router = new express.Router();
const {
	beforeGetOnlineUsers,
	beforeUpdateChannelSettings,
} = require('../../route-hooks/client/user');
const {
	handleGetMeRequest,
	handleGetOnlineUsersRequest,
	handleUpdateChannelSettings,
} = require('../../route-handlers/client/user');

router.get(
	'/id=me',
	handleGetMeRequest,
);

router.put(
	'/id=me/channel-settings',
	beforeUpdateChannelSettings,
	handleUpdateChannelSettings,
);

router.get(
	'/',
	beforeGetOnlineUsers,
	handleGetOnlineUsersRequest,
);

module.exports = router;
