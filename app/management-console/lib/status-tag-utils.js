import React from 'react';
import { StatusTag } from 'ljit-react-components';
import { TagsStatusEnums } from './enums';

const { StatusEnums: TagStatusEnums } = StatusTag;
const getStatusMap = (statusMap, status) => statusMap[status] || {};

export const getStatusOptions = statusMap => {
	const options = Object.keys(statusMap).map(value => {
		const { text: label } = getStatusMap(statusMap, value);

		return { label, value };
	});

	return options;
};

export const renderStatus = statusMap => status => {
	const { statusTag, text } = getStatusMap(statusMap, status);

	return <StatusTag status={statusTag} text={text}/>;
};

const { SELECTABLE, UNSELECTABLE } = TagsStatusEnums;

export const labelStatusMap = {
	[SELECTABLE]: { text: '可选择', statusTag: TagStatusEnums.SUCCESS },
	[UNSELECTABLE]: { text: '不可选', statusTag: TagStatusEnums.ERROR },
};
