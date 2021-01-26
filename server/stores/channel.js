const escapeStringRegexp = require('escape-string-regexp');
const {
	create,
	find,
	findOne,
	findOneAndUpdate,
	count,
} = require('../models/channel');
const {
	ENUM_CHANNEL_STATUS,
} = require('../lib/enum');
const { getSkipByPageAndLimit } = require('./common');
const NAME_ONLY_PROJECTIONS = [
	'_id',
	'name',
];
const ID_ONLY_PROJECTIONS = [
	'_id',
];

function createChannel(name) {
	return create({
		name,
		status: ENUM_CHANNEL_STATUS.ACTIVE,
	})
		.exec({ lean: false });
}

function getActiveChannels({ projections } = {}) {
	return find(
		{
			status: ENUM_CHANNEL_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({
			sort: { createdAt: 1 },
			lean: false,
		});
}

function getActiveChannelsByIds(ids, { projections } = {}) {
	return find(
		{
			_id: { $in: ids },
			status: ENUM_CHANNEL_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({
			sort: { createdAt: 1 },
			lean: false,
		});
}

function getActiveChannelsByPagination(page, {
	name,
	sort,
	limit,
	order,
	projections,
} = {}) {
	const skip = getSkipByPageAndLimit(page, limit);
	const filter = {
		status: ENUM_CHANNEL_STATUS.ACTIVE,
	};

	if (name) {
		filter.name = new RegExp(escapeStringRegexp(name), 'i');
	}

	return find(filter, projections).exec({
		sort: {
			[sort]: order,
		},
		skip,
		limit,
		lean: false,
	});
}

function getActiveChannelById(id, {
	projections,
} = {}) {
	return findOne(
		{
			_id: id,
			status: ENUM_CHANNEL_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({ lean: false });
}

function updateActiveChannelById(id, {
	name,
}, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		status: ENUM_CHANNEL_STATUS.ACTIVE,
	}, {
		$set: { name },
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function deleteActiveChannelById(id, {
	projections,
} = {}) {
	return findOneAndUpdate({
		_id: id,
		status: ENUM_CHANNEL_STATUS.ACTIVE,
	}, {
		$set: {
			status: ENUM_CHANNEL_STATUS.ARCHIVED,
		},
		$inc: { __v: 1 },
	}, {
		new: true,
		fields: projections,
	})
		.exec({ lean: false });
}

function countActiveChannels({ name } = {}) {
	const filter = {
		status: ENUM_CHANNEL_STATUS.ACTIVE,
	};

	if (name) {
		filter.name = new RegExp(escapeStringRegexp(name), 'i');
	}

	return count(filter).exec();
}

module.exports = {
	createChannel,
	getActiveChannels,
	getActiveChannelsByIds,
	getActiveChannelsByPagination,
	getActiveChannelById,
	countActiveChannels,
	updateActiveChannelById,
	deleteActiveChannelById,

	NAME_ONLY_PROJECTIONS,
	ID_ONLY_PROJECTIONS,
};
