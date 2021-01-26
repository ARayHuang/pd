const {
	create,
	find,
	findOne,
	findOneAndUpdate,
	count,
} = require('../models/tag');
const {
	ENUM_TAG_STATUS,
} = require('../lib/enum');
const escapeStringRegexp = require('escape-string-regexp');
const NAME_AND_COLOR_PROJECTIONS = [
	'_id',
	'name',
	'fontColor',
	'backgroundColor',
];
const ID_ONLY_PROJECTIONS = [
	'_id',
];
const MIN_PROJECTIONS = [
	'_id',
	'name',
	'fontColor',
	'backgroundColor',
	'status',
];

function createTag(rows) {
	return create(rows)
		.exec({ lean: false });
}

function getActiveTags({ projections } = {}) {
	return find(
		{
			status: ENUM_TAG_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({
			lean: false,
			sort: { createdAt: -1 },
		});
}

function getActiveTagById(id, {
	projections,
} = {}) {
	return findOne(
		{
			_id: id,
			status: ENUM_TAG_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({ lean: false });
}

function getTagsWithinStatus(status, {
	name,
} = {}, {
	sort,
	order,
	projections,
} = {}) {
	const filter = {};

	if (name) {
		filter.name = { $regex: new RegExp(escapeStringRegexp(name), 'i') };
	}

	return find(
		{
			...filter,
			status: { $in: status },
		},
		projections,
	)
		.exec({
			sort: {
				[sort]: order,
			},
			lean: false,
		});
}

function countTagsWithinStatus(status, { name } = {}) {
	const filter = {};

	if (name) {
		filter.name = { $regex: new RegExp(escapeStringRegexp(name), 'i') };
	}

	return count({
		...filter,
		status: { $in: status },
	})
		.exec();
}

function getTagWithinStatusAndId(status, id, {
	projections,
} = {}) {
	return findOne(
		{
			_id: id,
			status: { $in: status },
		},
		projections,
	)
		.exec({ lean: false });
}

function updateTagById(id, {
	status,
}, {
	projections,
} = {}) {
	return findOneAndUpdate(
		{
			_id: id,
			status: { $ne: ENUM_TAG_STATUS.ARCHIVED },
		}, {
			$set: { status },
			$inc: { __v: 1 },
		}, {
			new: true,
			fields: projections,
		},
	)
		.exec({ lean: false });
}

function deleteTagById(id, {
	projections,
} = {}) {
	return findOneAndUpdate(
		{
			_id: id,
			status: { $ne: ENUM_TAG_STATUS.ARCHIVED },
		}, {
			$set: { status: ENUM_TAG_STATUS.ARCHIVED },
			$inc: { __v: 1 },
		}, {
			new: true,
			fields: projections,
		},
	)
		.exec({ lean: false });
}

module.exports = {
	createTag,
	getActiveTags,
	getActiveTagById,
	deleteTagById,
	updateTagById,
	getTagWithinStatusAndId,
	getTagsWithinStatus,
	countTagsWithinStatus,

	NAME_AND_COLOR_PROJECTIONS,
	ID_ONLY_PROJECTIONS,
	MIN_PROJECTIONS,
};
