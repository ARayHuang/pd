import PropTypes from 'prop-types';
import {
	UserTypeEnums,
	DepartmentTypeEnums,
	ShiftTypeEnums,
	TagsStatusEnums,
	FileTypeEnums,
	LogTypeEnums,
} from './enums';
import { OrderStatusEnums } from '../../lib/enums';

export const UserPropTypes = PropTypes.shape({
	id: PropTypes.string,
	username: PropTypes.string,
	displayName: PropTypes.string,
	type: PropTypes.oneOf(Object.values(UserTypeEnums)),
	departmentType: PropTypes.oneOf(Object.values(DepartmentTypeEnums)),
	shiftType: PropTypes.oneOf(Object.values(ShiftTypeEnums)),
	profilePictureId: PropTypes.oneOf(['1', '2', '3', '4', '5', '6']),
	channels: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
	})),
});

export const UsersPropTypes = PropTypes.shape({
	users: PropTypes.arrayOf(UserPropTypes),
	page: PropTypes.number,
	numOfItems: PropTypes.number,
	numOfPages: PropTypes.number,
});

export const ChannelsPropTypes = PropTypes.shape({
	id: PropTypes.string,
	name: PropTypes.string,
});

export const MePropTypes = PropTypes.shape({
	id: PropTypes.string,
	username: PropTypes.string,
	displayName: PropTypes.string,
	type: PropTypes.string,
	departmentType: PropTypes.string,
	shiftType: PropTypes.string,
	profilePictureId: PropTypes.string,
	channels: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
	})),
});

export const TagPropTypes = PropTypes.shape({
	id: PropTypes.string,
	name: PropTypes.string,
	backgoundColor: PropTypes.string,
	fontColor: PropTypes.string,
	status: PropTypes.oneOf(Object.values(TagsStatusEnums)),
});

export const TagsPropTypes = PropTypes.arrayOf(TagPropTypes);

export const ChannelOptionsPropTypes = PropTypes.arrayOf(PropTypes.shape({
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
}));

const {
	IMAGE,
	VIDEO,
} = FileTypeEnums;
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

export const OrderPropTypes = PropTypes.shape({
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
		backgoundColor: PropTypes.string,
		fontColor: PropTypes.string,
	})),
	description: PropTypes.string,
	status: PropTypes.oneOf(Object.values(OrderStatusEnums)),
	createdAt: PropTypes.string,
	completedAt: PropTypes.string,
	serialNumber: PropTypes.string,
});

export const OrdersPropTypes = PropTypes.arrayOf(OrderPropTypes);

export const LogsPropTypes = PropTypes.arrayOf(PropTypes.shape({
	createdAt: PropTypes.string,
	id: PropTypes.string,
	operator: PropTypes.shape({
		displayName: PropTypes.string,
		id: PropTypes.string,
	}),
	type: PropTypes.oneOf(Object.values(LogTypeEnums)),
}));

export const CommentPropTypes = PropTypes.shape({
	content: PropTypes.string,
	createdAt: PropTypes.string,
	id: PropTypes.string,
	user: PropTypes.shape({
		displayName: PropTypes.string,
		id: PropTypes.string,
		profilePictureId: PropTypes.string,
	}),
});

export const OrderCommentsPropTypes = PropTypes.arrayOf(CommentPropTypes);
