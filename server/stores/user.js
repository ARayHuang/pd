const ObjectId = require('mongoose').Types.ObjectId;
const { generateKeyAndIv } = require('ljit-encryption');
const { hashPassword } = require('../lib/cryptographic');
const {
	ENUM_USER_STATUS,
	ENUM_USER_TYPE,
	ENUM_CHANNEL_STATUS,
} = require('../lib/enum');
const {
	create,
	findOne,
	findOneAndUpdate,
	aggregate,
} = require('../models/user');
const { getSkipByPageAndLimit } = require('./common');
const escapeStringRegexp = require('escape-string-regexp');
const MongoMatchBuilder = require('../lib/mongo-query-builder/mongo-match-builder');
const MongoLookupBuilder = require('../lib/mongo-query-builder/mongo-lookup-builder');
const ID_ONLY_PROJECTIONS = [
	'_id',
];
const USER_PROJECTIONS = [
	'_id',
	'username',
	'displayName',
	'type',
	'departmentType',
	'shiftType',
	'profilePictureId',
	'channels',
	'hasPermissionToAddStaff',
];
const DEPARTMENT_TYPE_AND_DISPLAY_NAME_PROJECTIONS = [
	'_id',
	'displayName',
	'departmentType',
];

function getActiveUserById(id, {
	projections,
} = {}) {
	return findOne(
		{
			_id: id,
			status: ENUM_USER_STATUS.ACTIVE,
		}, projections,
	)
		.exec({ lean: false });
}

function getActiveUserByUsername(username, {
	projections,
} = {}) {
	return findOne(
		{
			username,
			status: ENUM_USER_STATUS.ACTIVE,
		},
		projections,
	)
		.exec({ lean: false });
}

/**
 * @param {string} type
 * @param {number} page
 * @param {string|null} departmentType
 * @param {string|null} shiftType
 * @param {string|null} channelId
 * @param {string|null} displayName
 * @param {string|null} username
 * @param {string|null} channelName
 * @param {boolean|null} hasPermissionToAddStaff
 * @param {string} sort
 * @param {number} limit
 * @param {string} order - "desc", "asc"
 * @param {Array<string>} projections
 * @returns {Promise<Array<UserModel>>}
 */
async function getActiveUsersAndActiveChannelsByTypeAndPagination(type, page, {
	departmentType,
	shiftType,
	channelId,
	displayName,
	username,
	channelName,
	hasPermissionToAddStaff,
} = {}, {
	sort,
	limit,
	order,
} = {}) {
	const skip = getSkipByPageAndLimit(page, limit);
	const matchBuilder = new MongoMatchBuilder()
		.setEqual('status', ENUM_USER_STATUS.ACTIVE)
		.setEqual('type', type)
		.setEqual('departmentType', departmentType)
		.setEqual('shiftType', shiftType)
		.setEqual('hasPermissionToAddStaff', hasPermissionToAddStaff);

	if (displayName !== undefined) {
		matchBuilder.setRegex('displayName', new RegExp(escapeStringRegexp(displayName), 'i'));
	}

	if (username !== undefined) {
		matchBuilder.setRegex('username', new RegExp(escapeStringRegexp(username), 'i'));
	}

	const match = matchBuilder.build();
	const lookupBuilder = new MongoLookupBuilder()
		.setLookup({
			from: 'channels',
			let: { channels: '$channels' },
			as: 'channels',
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ $in: ['$_id', '$$channels'] },
								{ $eq: ['$status', ENUM_CHANNEL_STATUS.ACTIVE] },
							],
						},
					},
				},
				{
					$project: { _id: 0, id: '$_id', name: '$name' },
				},
			],
		});
	const lookup = lookupBuilder.build();
	const lookupMatchBuilder = new MongoMatchBuilder();

	if (channelId !== undefined) {
		lookupMatchBuilder.setEqual('channels.id', new ObjectId(channelId));
	}

	if (channelName !== undefined) {
		lookupMatchBuilder.setRegex('channels.name', new RegExp(escapeStringRegexp(channelName), 'i'));
	}

	const lookupMatch = lookupMatchBuilder.build();
	const aggregateLayers = [
		{ $match: match },
		...lookup,
		{ $match: lookupMatch },
		{ $sort: { [sort]: order } },
		{
			$project: {
				_id: 0,
				id: '$_id',
				username: '$username',
				displayName: '$displayName',
				type: '$type',
				departmentType: '$departmentType',
				shiftType: '$shiftType',
				profilePictureId: '$profilePictureId',
				channels: '$channels',
				hasPermissionToAddStaff: '$hasPermissionToAddStaff',
			},
		},
		{
			$facet: {
				data: [
					{ $skip: skip },
					{ $limit: limit },
				],
				count: [{ $count: 'count' }],
			},
		},
	];
	const result = await aggregate(aggregateLayers).exec();
	const { data, count } = result[0];
	let numOfItems = 0;

	if (count.length) {
		numOfItems = count[0].count;
	}

	return {
		data: data,
		numOfItems,
		numOfPages: Math.ceil(numOfItems / limit),
	};
}

/**
 * @param {ObjectId|string} id
 * @param {Array<string>} projections
 * @returns {Promise<UserModel>}
 */
function deleteActiveUserById(id, projections = {}) {
	return findOneAndUpdate(
		{
			_id: id,
			status: ENUM_USER_STATUS.ACTIVE,
		},
		{
			$set: {
				status: ENUM_USER_STATUS.ARCHIVED,
			},
			$inc: { __v: 1 },
		},
		{
			new: true,
			fields: projections,
		},
	)
		.exec({ lean: false });
}

function createManagerUser({
	profilePictureId,
	departmentType,
	displayName,
	password,
	username,
	hasPermissionToAddStaff,
}) {
	const key = generateKeyAndIv().key.toString('hex');

	return create({
		key,
		password: hashPassword(password, key),
		profilePictureId,
		departmentType,
		displayName,
		username,
		hasPermissionToAddStaff,
		type: ENUM_USER_TYPE.MANAGER,
		status: ENUM_USER_STATUS.ACTIVE,
	})
		.exec({ lean: false });
}

/**
 * @param {string} profilePictureId
 * @param {string} departmentType
 * @param {string} displayName
 * @param {string} password - The user input password.
 * @param {string} username
 * @param {Array<string>} channelIds
 * @param {string} shiftType
 * @returns {Promise<UserModel>}
 */
function createStaffUser({ profilePictureId, departmentType, displayName, password, username, channelIds, shiftType }) {
	const key = generateKeyAndIv().key.toString('hex');

	return create({
		key,
		password: hashPassword(password, key),
		profilePictureId,
		departmentType,
		displayName,
		username,
		channels: channelIds,
		shiftType,
		type: ENUM_USER_TYPE.STAFF,
		status: ENUM_USER_STATUS.ACTIVE,
	})
		.exec({ lean: false });
}

function updateMangerUserById(id, {
	profilePictureId,
	displayName,
	password,
	hasPermissionToAddStaff,
} = {}, {
	projections,
} = {}) {
	const key = generateKeyAndIv().key.toString('hex');
	const $set = {};

	if (profilePictureId) {
		$set.profilePictureId = profilePictureId;
	}

	if (displayName) {
		$set.displayName = displayName;
	}

	if (password) {
		$set.password = hashPassword(password, key);
		$set.key = key;
	}

	if (hasPermissionToAddStaff !== undefined) {
		$set.hasPermissionToAddStaff = hasPermissionToAddStaff;
	}

	return findOneAndUpdate(
		{
			_id: id,
			status: ENUM_USER_STATUS.ACTIVE,
			type: ENUM_USER_TYPE.MANAGER,
		},
		{
			$set,
			$inc: { __v: 1 },
		},
		{
			new: true,
			fields: projections,
		},
	).exec({ lean: false });
}

function updateStaffUserById(id, {
	profilePictureId,
	shiftType,
	channelIds,
	displayName,
	password,
} = {}, {
	projections,
} = {}) {
	const key = generateKeyAndIv().key.toString('hex');
	const $set = {};

	if (profilePictureId) {
		$set.profilePictureId = profilePictureId;
	}

	if (displayName) {
		$set.displayName = displayName;
	}

	if (password) {
		$set.password = hashPassword(password, key);
		$set.key = key;
	}

	if (shiftType) {
		$set.shiftType = shiftType;
	}

	if (channelIds) {
		$set.channels = channelIds;
	}

	return findOneAndUpdate(
		{
			_id: id,
			status: ENUM_USER_STATUS.ACTIVE,
			type: ENUM_USER_TYPE.STAFF,
		},
		{
			$set,
			$inc: { __v: 1 },
		},
		{
			new: true,
			fields: projections,
		},
	)
		.exec({ lean: false });
}

function updateChannelSettingsById(id, channelSettings, {
	projections,
} = {}) {
	return findOneAndUpdate(
		{
			_id: id,
			status: ENUM_USER_STATUS.ACTIVE,
		},
		{
			channelSettings,
			$inc: { __v: 1 },
		},
		{
			new: true,
			fields: projections,
		},
	)
		.exec({ lean: false });
}

module.exports = {
	getActiveUserById,
	getActiveUserByUsername,
	getActiveUsersAndActiveChannelsByTypeAndPagination,
	createManagerUser,
	createStaffUser,
	deleteActiveUserById,
	updateMangerUserById,
	updateStaffUserById,
	updateChannelSettingsById,

	ID_ONLY_PROJECTIONS,
	USER_PROJECTIONS,
	DEPARTMENT_TYPE_AND_DISPLAY_NAME_PROJECTIONS,
};
