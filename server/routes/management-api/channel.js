const express = require('express');
const router = new express.Router();
const {
	beforeGetChannelsRequest,
	beforeCreateChannelRequest,
	beforeGetChannelRequest,
	beforeUpdateChannelRequest,
	beforeDeleteChannelRequest,
} = require('../../route-hooks/management/channel');
const {
	handleGetChannelsRequest,
	handleCreateChannelRequest,
	handleGetChannelRequest,
	handleUpdateChannelRequest,
	handleDeleteChannelRequest,
} = require('../../route-handlers/management/channel');

router.get(
	'/',
	beforeGetChannelsRequest,
	handleGetChannelsRequest,
);

router.get(
	'/id=:channelId',
	beforeGetChannelRequest,
	handleGetChannelRequest,
);

router.post(
	'/',
	beforeCreateChannelRequest,
	handleCreateChannelRequest,
);

router.put(
	'/id=:channelId',
	beforeUpdateChannelRequest,
	handleUpdateChannelRequest,
);

router.delete(
	'/id=:channelId',
	beforeDeleteChannelRequest,
	handleDeleteChannelRequest,
);

module.exports = router;
