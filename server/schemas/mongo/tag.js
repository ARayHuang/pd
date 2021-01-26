const {
	ENUM_TAG_STATUS,
} = require('../../lib/enum');
const schema = {
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(ENUM_TAG_STATUS),
	},
	backgroundColor: {
		type: String,
		required: true,
	},
	fontColor: {
		type: String,
		required: true,
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
				status: ENUM_TAG_STATUS.ACTIVE,
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
