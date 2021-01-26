const { ENUM_TAG_STATUS } = require('../../enum');

module.exports = {
	backgroundColor: {
		type: 'string',
		empty: false,
		pattern: /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
	},
	fontColor: {
		type: 'string',
		empty: false,
		pattern: /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
	},
	name: {
		type: 'string',
		empty: false,
		trim: true,
		max: 1024,
	},
	status: {
		type: 'string',
		enum: [ENUM_TAG_STATUS.ACTIVE, ENUM_TAG_STATUS.DISABLED],
	},
};
