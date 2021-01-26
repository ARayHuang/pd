const express = require('express');
const {
	handleLougoutRequest,
} = require('../../route-handlers/client/logout');
const router = new express.Router();

router.post(
	'/',
	handleLougoutRequest,
);

module.exports = router;
