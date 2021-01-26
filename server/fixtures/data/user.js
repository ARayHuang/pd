const {
	ENUM_USER_TYPE,
	ENUM_USER_DEPARTMENT,
	ENUM_USER_STATUS,
	ENUM_USER_PROFILE_PICTURE_ID,
} = require('../../lib/enum');

module.exports = [
	{
		username: 'admin',
		password: '123qwe',
		displayName: '管理员',
		profilePictureId: ENUM_USER_PROFILE_PICTURE_ID.AVATAR_1,
		type: ENUM_USER_TYPE.ADMIN,
		departmentType: ENUM_USER_DEPARTMENT.PROVIDER,
		channels: [],
		status: ENUM_USER_STATUS.ACTIVE,
	},
];
