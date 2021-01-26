const {
	ENUM_CHANNEL_STATUS,
} = require('../../lib/enum');
const schema = {
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(ENUM_CHANNEL_STATUS),
	},
};
const indexes = [
	{
		fields: {
			name: 1,
		},
		options: {
			unique: true,
			partialFilterExpression: {
				status: ENUM_CHANNEL_STATUS.ACTIVE,
			},
		},
	},
	{
		fields: {
			status: 1,
			createdAt: 1,
		},
	},
];

module.exports = { schema, indexes };
