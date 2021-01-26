const { Schema } = require('mongoose');
const {
	ENUM_USER_TYPE,
	ENUM_USER_STATUS,
	ENUM_USER_DEPARTMENT,
	ENUM_USER_SHIFT,
	ENUM_USER_PROFILE_PICTURE_ID,
} = require('../../lib/enum');
const schema = {
	username: {
		type: String,
		required: true,
	},
	key: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	profilePictureId: {
		type: String,
		required: false,
		enum: Object.values(ENUM_USER_PROFILE_PICTURE_ID),
	},
	type: {
		type: String,
		required: true,
		enum: Object.values(ENUM_USER_TYPE),
	},
	channels: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'channels',
		}],
		required: true,
	},
	departmentType: {
		type: String,
		required: true,
		enum: Object.values(ENUM_USER_DEPARTMENT),
	},
	shiftType: {
		type: String,
		required: false,
		enum: Object.values(ENUM_USER_SHIFT),
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(ENUM_USER_STATUS),
	},
	channelSettings: {
		type: [
			{
				_id: false,
				id: {
					type: Schema.Types.ObjectId,
					required: true,
				},
				isFavorite: {
					type: Boolean,
					required: true,
				},
			},
		],
	},
	hasPermissionToAddStaff: {
		type: Boolean,
		default: true,
	},
};
const indexes = [
	{
		fields: {
			username: 1,
		},
		options: {
			unique: true,
			collation: {
				locale: 'en',
				strength: 2,
			},
			partialFilterExpression: {
				status: ENUM_USER_STATUS.ACTIVE,
			},
		},
	},
	{
		fields: {
			status: 1,
			username: 1,
		},
	},
	{
		fields: { status: 1, createdAt: 1 },
	},
	{
		fields: { status: 1, type: 1, createdAt: 1 },
	},
	{
		fields: { status: 1, type: 1, departmentType: 1, createdAt: 1 },
	},
];

module.exports = { schema, indexes };
