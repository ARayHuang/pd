const {
	ENUM_USER_TYPE,
	ENUM_USER_DEPARTMENT,
	ENUM_USER_STATUS,
	ENUM_USER_PROFILE_PICTURE_ID,
	ENUM_USER_SHIFT,
} = require('../../lib/enum');

module.exports = [
	{
		_id: '5ec4ec469d87c4387d9350b9',
		username: 'admin',
		password: '123qwe',
		displayName: '管理员',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.ADMIN,
		departmentType: ENUM_USER_DEPARTMENT.PROVIDER,
		channels: [],
		status: ENUM_USER_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:00.000Z'),
	},
	{
		_id: '5ec4ec469d87c4387d9350ba',
		username: 'provider01',
		password: '123qwe',
		displayName: '开单组管理员',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.MANAGER,
		departmentType: ENUM_USER_DEPARTMENT.PROVIDER,
		channels: [],
		status: ENUM_USER_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:01.000Z'),
	},
	{
		_id: '5ec4ec469d87c4387d9350bb',
		username: 'provider02',
		password: '123qwe',
		displayName: '开单组员工',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.STAFF,
		departmentType: ENUM_USER_DEPARTMENT.PROVIDER,
		shiftType: ENUM_USER_SHIFT.MORNING,
		channels: [
			'5ec5f60b25fbb049dbd231e2',
		],
		status: ENUM_USER_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:02.000Z'),
	},
	{
		_id: '5ec4ec469d87c4387d9350bc',
		username: 'consumer01',
		password: '123qwe',
		displayName: '接单组管理员',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.MANAGER,
		departmentType: ENUM_USER_DEPARTMENT.CONSUMER,
		channels: [],
		status: ENUM_USER_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:03.000Z'),
	},
	{
		_id: '5ec4ec469d87c4387d9350bd',
		username: 'consumer02',
		password: '123qwe',
		displayName: '接单组员工',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.STAFF,
		departmentType: ENUM_USER_DEPARTMENT.CONSUMER,
		shiftType: ENUM_USER_SHIFT.MORNING,
		channels: [
			'5ec5f60b25fbb049dbd231e2',
		],
		status: ENUM_USER_STATUS.ACTIVE,
		createdAt: new Date('2020-06-22 05:42:04.000Z'),
	},
];
