const express = require('express');
const router = new express.Router();
const {
	beforeGetTagsRequest,
	beforeDeleteTagRequest,
	beforeCreateTagRequest,
	beforeUpdateTagRequest,
	beforeGetTagRequest,
} = require('../../route-hooks/management/tag');
const {
	handleGetTagsRequest,
	handleDeleteTagRequest,
	handleCreateTagRequest,
	handleUpdateTagRequest,
	handleGetTagRequest,
} = require('../../route-handlers/management/tag');

router.get(
	'/',
	beforeGetTagsRequest,
	handleGetTagsRequest,
);

router.put(
	'/id=:tagId',
	beforeUpdateTagRequest,
	handleUpdateTagRequest,
);

router.post(
	'/',
	beforeCreateTagRequest,
	handleCreateTagRequest,
);

router.get(
	'/id=:tagId',
	beforeGetTagRequest,
	handleGetTagRequest,
);

router.delete(
	'/id=:tagId',
	beforeDeleteTagRequest,
	handleDeleteTagRequest,
);

module.exports = router;
