const { Schema } = require('mongoose');
const {
	ENUM_LOG_TYPE,
} = require('../../lib/enum');
const schema = {
	operator: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	type: {
		type: String,
		required: true,
		enum: Object.values(ENUM_LOG_TYPE),
	},
	orderId: {
		type: Schema.Types.ObjectId,
	},
	associateUser: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	details: {
		type: Object,
		required: false,
	},
};
const indexes = [
	{
		fields: { orderId: 1, createdAt: 1 },
	},
];

module.exports = { schema, indexes };
