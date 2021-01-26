const {
	ENUM_USER_PROFILE_PICTURE_ID,
	ENUM_USER_DEPARTMENT,
	ENUM_USER_SHIFT,
	ENUM_USER_TYPE,
} = require('../../../lib/enum');
const {
	generateIdSchema,
} = require('../');

module.exports = {
	username: {
		type: 'string',
		empty: false,
		trim: true,
		max: 20,
	},
	password: {
		type: 'string',
		empty: false,
		max: 1024,
	},
	profilePictureId: {
		type: 'string',
		enum: Object.values(ENUM_USER_PROFILE_PICTURE_ID),
	},
	type: {
		type: 'string',
		enum: Object.values(ENUM_USER_TYPE),
	},
	departmentType: {
		type: 'string',
		enum: Object.values(ENUM_USER_DEPARTMENT),
	},
	shiftType: {
		type: 'string',
		optional: true,
		enum: Object.values(ENUM_USER_SHIFT),
	},
	channelIds: {
		type: 'array',
		unique: true,
		items: generateIdSchema(),
	},
	displayName: {
		type: 'string',
		empty: false,
		trim: true,
		max: 1024,
	},
	channelSettings: {
		type: 'array',
		items: {
			type: 'object',
			props: {
				id: generateIdSchema(),
				isFavorite: {
					type: 'boolean',
				},
			},
		},
		custom(values, errors) {
			const channelIds = values.map(x => x && x.id);
			const idSet = new Set(channelIds);

			if (idSet.size !== values.length) {
				errors.push({
					type: 'arrayUnique',
					expected: Array.from(idSet),
					actual: channelIds,
				});
			}

			return values;
		},
	},
	hasPermissionToAddStaff: {
		type: 'boolean',
	},
};
