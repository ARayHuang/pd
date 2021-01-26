const { Schema } = require('mongoose');
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
	content: {
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
