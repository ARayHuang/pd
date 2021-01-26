import React from 'react';
import PropTypes from 'prop-types';
import { Tag as AntdTag } from 'antd';
import './styles.styl';

const propTypes = {
	tag: PropTypes.shape({
		name: PropTypes.string,
		fontColor: PropTypes.string,
		backgroundColor: PropTypes.string,
	}),
};
const defaultProps = {
	tag: {},
};
const PREFIX_CLASS = 'order-tag';
const Tag = ({
	tag,
} = {}) => {
	const {
		name,
		fontColor,
		backgroundColor,
	} = tag;
	const tagBackgroundColor = `#${backgroundColor}`;
	const tagStyles = { color: `#${fontColor}` };

	return (
		<AntdTag
			color={tagBackgroundColor}
			style={tagStyles}
			className={PREFIX_CLASS}
		>
			{name}
		</AntdTag>
	);
};

Tag.propTypes = propTypes;
Tag.defaultProps = defaultProps;

export default Tag;
