const {
	ENUM_ORDER_FILE_TYPE,
} = require('../../lib/enum');

module.exports = [
	{
		orderId: '5ed7496b9ee92451f2e76232',
		user: '5ec4ec469d87c4387d9350ba',
		type: ENUM_ORDER_FILE_TYPE.IMAGE,
		filename: 'image01',
		createdAt: new Date('2020-06-22 05:42:00.000Z'),
	},
	{
		orderId: '5ed7496b9ee92451f2e76232',
		user: '5ec4ec469d87c4387d9350bc',
		type: ENUM_ORDER_FILE_TYPE.VIDEO,
		filename: 'video01',
		createdAt: new Date('2020-06-22 05:42:01.000Z'),
	},
	{
		orderId: '5ed7496b9ee92451f2e76233',
		user: '5ec4ec469d87c4387d9350bd',
		type: ENUM_ORDER_FILE_TYPE.IMAGE,
		filename: 'image02',
		createdAt: new Date('2020-06-22 05:42:02.000Z'),
	},
	{
		orderId: '5ed7496b9ee92451f2e76233',
		user: '5ec4ec469d87c4387d9350bb',
		type: ENUM_ORDER_FILE_TYPE.VIDEO,
		filename: 'video02',
		createdAt: new Date('2020-06-22 05:42:03.000Z'),
	},
];
