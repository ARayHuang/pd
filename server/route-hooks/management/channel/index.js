module.exports = {
	beforeCreateChannelRequest: require('./create-channel-request').before,
	beforeGetChannelsRequest: require('./get-channels-request').before,
	beforeGetChannelRequest: require('./get-channel-request').before,
	beforeUpdateChannelRequest: require('./update-channel-request').before,
	beforeDeleteChannelRequest: require('./delete-channel-request').before,
};
