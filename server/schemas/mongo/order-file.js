const { Schema } = require('mongoose');
const {
	ENUM_ORDER_FILE_TYPE,
} = require('../../lib/enum');
const schema = {
	orderId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	type: {
		type: String,
		required: true,
		enum: Object.values(ENUM_ORDER_FILE_TYPE),
	},
	filename: {
		type: String,
		required: true,
	},
};
const indexes = [
	{
		fields: { orderId: 1, createdAt: 1 },
	},
];

module.exports = { schema, indexes };
