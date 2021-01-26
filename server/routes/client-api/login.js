const express = require('express');
const router = new express.Router();
const {
	beforeLoginRequest,
} = require('../../route-hooks/client/login');
const {
	handleSuccessfulLoginRequest,
} = require('../../route-handlers/client/login');

router.post(
	'/',
	beforeLoginRequest,
	handleSuccessfulLoginRequest,
);

module.exports = router;
