const { ENUM_ORDER_STATUS } = require('../../enum');

module.exports = {
	customerName: {
		type: 'string',
		empty: false,
		trim: true,
		max: 1024,
	},
	description: {
		type: 'string',
		empty: false,
		tirm: true,
		min: 5,
		max: 30,
	},
	status: {
		type: 'string',
		enum: Object.values(ENUM_ORDER_STATUS),
	},
	serialNumber: {
		type: 'string',
		empty: false,
		pattern: /^[A-Za-z0-9]{10}$/,
	},
};
