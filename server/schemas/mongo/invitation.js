const { Schema } = require('mongoose');
const {
	ENUM_INVITATION_STATUS,
	ENUM_INVITATION_TYPE,
} = require('../../lib/enum');
const schema = {
	status: {
		type: String,
		required: true,
		enum: Object.values(ENUM_INVITATION_STATUS),
	},
	type: {
		type: String,
		required: true,
		enum: Object.values(ENUM_INVITATION_TYPE),
	},
	order: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'orders',
	},
	// 發送邀請的使用者
	inviter: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	// 接收邀請的使用者
	invitee: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
};
const indexes = [
];

module.exports = { schema, indexes };
