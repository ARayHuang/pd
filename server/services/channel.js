const ChannelStore = require('../stores/channel');

async function getActiveChannelsByPagination(page, {
	name,
	sort,
	limit,
	order,
	projections,
} = {}) {
	const data = await ChannelStore.getActiveChannelsByPagination(page, {
		name,
		sort,
		limit,
		order,
		projections,
	});
	const numOfItems = await ChannelStore.countActiveChannels({ name });

	return {
		data,
		numOfItems,
		numOfPages: Math.ceil(numOfItems / limit),
	};
}

module.exports = {
	createChannel: ChannelStore.createChannel,
	getActiveChannelsByPagination,
	getActiveChannels: ChannelStore.getActiveChannels,
	getActiveChannelsByIds: ChannelStore.getActiveChannelsByIds,
	getActiveChannelById: ChannelStore.getActiveChannelById,
	updateActiveChannelById: ChannelStore.updateActiveChannelById,
	deleteActiveChannelById: ChannelStore.deleteActiveChannelById,
	countActiveChannels: ChannelStore.countActiveChannels,

	CHANNEL_PROJECTIONS: {
		ID: ChannelStore.ID_ONLY_PROJECTIONS,
		NAME: ChannelStore.NAME_ONLY_PROJECTIONS,
	},
};
