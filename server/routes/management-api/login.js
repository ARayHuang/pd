const express = require('express');
const {
	beforeLoginRequest,
} = require('../../route-hooks/management/login');
const {
	handleSuccessfulLoginRequest,
} = require('../../route-handlers/management/login');
const router = new express.Router();

router.post(
	'/',
	beforeLoginRequest,
	handleSuccessfulLoginRequest,
);

module.exports = router;
