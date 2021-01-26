const express = require('express');
const router = new express.Router();
const {
	handleGetTagsRequest,
} = require('../../route-handlers/client/tag');

router.get(
	'/',
	handleGetTagsRequest,
);

module.exports = router;
