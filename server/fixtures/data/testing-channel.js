const {
	ENUM_CHANNEL_STATUS,
} = require('../../lib/enum');

module.exports = [
	{
		_id: '5ec5f60b25fbb049dbd231e2',
		name: '频道一',
		status: ENUM_CHANNEL_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:00.000Z'),
	},
	{
		_id: '5ec5f60b25fbb049dbd231e3',
		name: '封存频道',
		status: ENUM_CHANNEL_STATUS.ARCHIVED,
		createdAt: new Date('2020-06-22 05:42:01.000Z'),
	},
];
