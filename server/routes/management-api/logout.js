const express = require('express');
const {
	handleLogoutRequest,
} = require('../../route-handlers/management/logout');
const router = new express.Router();

router.post(
	'/',
	handleLogoutRequest,
);

module.exports = router;
