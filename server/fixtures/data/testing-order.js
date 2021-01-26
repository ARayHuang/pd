const {
	ENUM_ORDER_STATUS,
} = require('../../lib/enum');
const date = new Date();

date.setDate(date.getDate() - 3);

module.exports = [
	{
		_id: '5ed7496b9ee92451f2e76231',
		tags: [
			'5ed7351e4f46070bd8e2dfe6',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350ba',
		customerName: '客戶一',
		description: 'R1234567890',
		status: ENUM_ORDER_STATUS.CREATED,
		createdAt: new Date(date),
	},
	{
		_id: '5ed7496b9ee92451f2e76232',
		tags: [
			'5ed7351e4f46070bd8e2dfe7',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350ba',
		handler: '5ec4ec469d87c4387d9350bc',
		customerName: '客戶二',
		description: 'R1234567891',
		status: ENUM_ORDER_STATUS.ACCEPTED,
		createdAt: new Date(date.getTime() + 1000),
	},
	{
		_id: '5ed7496b9ee92451f2e76233',
		tags: [
			'5ed7351e4f46070bd8e2dfe7',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350bb',
		handler: '5ec4ec469d87c4387d9350bd',
		customerName: '客戶三',
		description: 'R1234567892',
		status: ENUM_ORDER_STATUS.RESOLVED,
		createdAt: new Date(date.getTime() + 2000),
	},
	{
		_id: '5ed7496b9ee92451f2e76234',
		tags: [
			'5ed7351e4f46070bd8e2dfe7',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350bb',
		handler: '5ec4ec469d87c4387d9350bd',
		customerName: '客戶一',
		description: 'R1234567893',
		status: ENUM_ORDER_STATUS.TRACKED,
		createdAt: new Date(date.getTime() + 3000),
	},
	{
		_id: '5ed7496b9ee92451f2e76235',
		tags: [
			'5ed7351e4f46070bd8e2dfe7',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350ba',
		handler: '5ec4ec469d87c4387d9350bd',
		customerName: '客戶一',
		description: 'R1234567894',
		status: ENUM_ORDER_STATUS.COMPLETED,
		createdAt: new Date(date.getTime() + 4000),
		completedAt: new Date(date.getTime() + 5000),
	},
	{
		_id: '5ed7496b9ee92451f2e76236',
		tags: [
			'5ed7351e4f46070bd8e2dfe7',
		],
		channelId: '5ec5f60b25fbb049dbd231e2',
		owner: '5ec4ec469d87c4387d9350bb',
		handler: '5ec4ec469d87c4387d9350bc',
		customerName: '客戶二',
		description: 'R1234567895',
		status: ENUM_ORDER_STATUS.DELETED,
		createdAt: new Date(date.getTime() + 6000),
	},
];
