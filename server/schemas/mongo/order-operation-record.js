const { Schema } = require('mongoose');
const {
	ENUM_ORDER_OPERATION_TYPE,
} = require('../../lib/enum');
const schema = {
	operatorId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: Object.values(ENUM_ORDER_OPERATION_TYPE),
	},
	orderId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
};
const indexes = [
	{
		fields: { orderId: 1, operatorId: 1, createdAt: 1 },
	},
];

module.exports = { schema, indexes };
