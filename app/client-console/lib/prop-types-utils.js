import PropTypes from 'prop-types';
import {
	UserTypeEnums,
	ClientDepartmentTypeEnums,
	ShiftTypeEnums,
	FileTypeEnums,
	OrderStatusEnums,
} from './enums';

const {
	ADMIN,
	MANAGER,
	STAFF,
} = UserTypeEnums;
const {
	OWNER,
	PROVIDER,
	CONSUMER,
} = ClientDepartmentTypeEnums;
const {
	IMAGE,
	VIDEO,
} = FileTypeEnums;
const {
	CREATED,
	ACCEPTED,
	RESOLVED,
	TRACKED,
	COMPLETED,
	DELETED,
} = OrderStatusEnums;
const {
	MORNING,
	NOON,
	NIGHT,
} = ShiftTypeEnums;
const FilePropTypes = {
	id: PropTypes.string,
	filename: PropTypes.string,
	type: PropTypes.oneOf([IMAGE, VIDEO]),
	url: PropTypes.string,
	createdAt: PropTypes.string,
};

export const VideoPropTypes = PropTypes.shape(FilePropTypes);

export const ImagePropTypes = PropTypes.shape({
	...FilePropTypes,
	thumbnailUrl: PropTypes.string,
});

const DefaultOrderPropTypes = {
	id: PropTypes.string,
	channelId: PropTypes.string,
	owner: PropTypes.shape({
		id: PropTypes.string,
		displayName: PropTypes.string,
	}),
	handler: PropTypes.shape({
		id: PropTypes.string,
		displayName: PropTypes.string,
	}),
	customerName: PropTypes.string,
	tags: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		backgroundColor: PropTypes.string,
		fontColor: PropTypes.string,
	})),
	description: PropTypes.string,
	status: PropTypes.oneOf([CREATED, ACCEPTED, RESOLVED, TRACKED, COMPLETED, DELETED]),
	createdAt: PropTypes.string,
	serialNumber: PropTypes.string,
	hasNewActivity: PropTypes.bool,
};

export const OrderPropTypes = PropTypes.shape({
	...DefaultOrderPropTypes,
	files: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		filename: PropTypes.string,
		type: PropTypes.oneOf([IMAGE, VIDEO]),
		url: PropTypes.string,
		thumbnailUrl: PropTypes.string,
		createdAt: PropTypes.string,
	})),
});

export const OrdersPropTypes = PropTypes.shape({
	data: PropTypes.arrayOf(PropTypes.shape({
		...DefaultOrderPropTypes,
		completedAt: PropTypes.string,
	})),
	page: PropTypes.number,
	numOfItems: PropTypes.number,
	numOfPages: PropTypes.number,
});

export const MePropTypes = PropTypes.shape({
	id: PropTypes.string,
	username: PropTypes.string,
	displayName: PropTypes.string,
	type: PropTypes.oneOf([ADMIN, MANAGER, STAFF]),
	departmentType: PropTypes.oneOf([OWNER, PROVIDER, CONSUMER]),
	shiftType: PropTypes.oneOf([MORNING, NOON, NIGHT]),
	profilePictureId: PropTypes.string,
	channels: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
	})),
	channelSettings: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		isFavorite: PropTypes.bool,
	})),
});

export const ChannelPropTypes = PropTypes.shape({
	id: PropTypes.string,
	name: PropTypes.string,
});

export const ChannelsPropTypes = PropTypes.arrayOf(PropTypes.shape({
	id: PropTypes.string,
	name: PropTypes.string,
}));

export const TagsPropTypes = PropTypes.arrayOf(PropTypes.shape({
	id: PropTypes.string,
	name: PropTypes.string,
	backgroundColor: PropTypes.string,
	fontColor: PropTypes.string,
}));

export const CommentPropTypes = PropTypes.shape({
	user: PropTypes.shape({
		displayName: PropTypes.string,
		profilePictureId: PropTypes.string,
	}),
	id: PropTypes.string,
	content: PropTypes.string,
	createdAt: PropTypes.string,
});
