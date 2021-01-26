const TagStore = require('../stores/tag');

async function getTagsWithinStatus(status, {
	name,
}, {
	sort,
	order,
	projections,
}) {
	const data = await TagStore.getTagsWithinStatus(status, {
		name,
	}, {
		sort,
		order,
		projections,
	});

	return {
		data,
		numOfItems: data.length,
		numOfPages: 1,
	};
}

module.exports = {
	createTag: TagStore.createTag,
	getActiveTags: TagStore.getActiveTags,
	getActiveTagById: TagStore.getActiveTagById,
	deleteTagById: TagStore.deleteTagById,
	updateTagById: TagStore.updateTagById,
	getTagWithinStatusAndId: TagStore.getTagWithinStatusAndId,
	getTagsWithinStatus,
	countTagsWithinStatus: TagStore.countTagsWithinStatus,

	TAG_PROJECTIONS: {
		ID: TagStore.ID_ONLY_PROJECTIONS,
		NAME_AND_COLOR: TagStore.NAME_AND_COLOR_PROJECTIONS,
		MIN: TagStore.MIN_PROJECTIONS,
	},
};
