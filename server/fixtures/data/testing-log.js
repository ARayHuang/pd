const {
	ENUM_LOG_TYPE,
} = require('../../lib/enum');

module.exports = [
	{
		_id: '5f0bf560cf21795568995832',
		operator: '5ec4ec469d87c4387d9350ba',
		type: ENUM_LOG_TYPE.CREATED_ORDER,
		orderId: '5ed7496b9ee92451f2e76231',
		createdAt: new Date('2020-06-22T05:42:27.000Z'),
	},
	{
		_id: '5f0c021c5d1c236aded45c88',
		operator: '5ec4ec469d87c4387d9350ba',
		type: ENUM_LOG_TYPE.CREATED_ORDER,
		orderId: '5ed7496b9ee92451f2e76232',
		createdAt: new Date('2020-06-22T05:42:28.000Z'),
	},
	{
		_id: '5f0c021c5d1c236aded45c89',
		operator: '5ec4ec469d87c4387d9350bc',
		type: ENUM_LOG_TYPE.ACCEPTED_ORDER,
		orderId: '5ed7496b9ee92451f2e76232',
		createdAt: new Date('2020-06-22T05:42:29.000Z'),
	},
	{
		_id: '5f0c021c5d1c236aded45c8a',
		operator: '5ec4ec469d87c4387d9350bb',
		type: ENUM_LOG_TYPE.CREATED_ORDER,
		orderId: '5ed7496b9ee92451f2e76233',
		createdAt: new Date('2020-06-22T05:42:29.000Z'),
	},
	{
		_id: '5f0c021c5d1c236aded45c8b',
		operator: '5ec4ec469d87c4387d9350bd',
		type: ENUM_LOG_TYPE.ACCEPTED_ORDER,
		orderId: '5ed7496b9ee92451f2e76233',
		createdAt: new Date('2020-06-22T05:42:30.000Z'),
	},
	{
		_id: '5f0c021c5d1c236aded45c8c',
		operator: '5ec4ec469d87c4387d9350bd',
		type: ENUM_LOG_TYPE.COMPLETED_ORDER,
		orderId: '5ed7496b9ee92451f2e76233',
		createdAt: new Date('2020-06-22T05:42:31.000Z'),
	},
];
