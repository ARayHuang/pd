const config = require('config');
const { Schema } = require('mongoose');
const nanoid = require('nanoid').customAlphabet(config.SERVER.NANO_ID_ALPHABET, 10);
const {
	ENUM_ORDER_STATUS,
} = require('../../lib/enum');
const schema = {
	serialNumber: {
		type: String,
		unique: true,
		default: () => nanoid(),
	},
	channelId: {
		type: Schema.Types.ObjectId,
		required: true,
		alias: 'channel',
		ref: 'channels',
	},
	owner: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	handler: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: 'users',
	},
	customerName: {
		type: String,
		required: true,
	},
	tags: {
		type: [
			{
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'tags',
			},
		],
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(ENUM_ORDER_STATUS),
	},
	completedAt: {
		type: Date,
		required: false,
	},
	completedVia: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: 'users',
	},
	resolvedAt: {
		type: Date,
		required: false,
	},
	resolvedVia: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: 'users',
	},
	coOwner: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: 'users',
	},
	coHandler: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: 'users',
	},
};
const indexes = [
	{
		fields: { channelId: 1, status: 1, createdAt: 1 },
	},
	{
		fields: { channelId: 1, tags: 1, status: 1, createdAt: 1 },
	},
	{
		fields: { createdAt: 1 },
	},
];

module.exports = { schema, indexes };
