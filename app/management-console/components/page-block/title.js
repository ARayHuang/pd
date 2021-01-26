import React from 'react';
import PropTypes from 'prop-types';
import { prefixClass } from './';

const propTypes = {
	text: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
};
const defaultProps = {
	text: '',
};
const PageBlockTitle = ({ text }) => <div className={`${prefixClass}__title`}>{text}</div>;

PageBlockTitle.propTypes = propTypes;
PageBlockTitle.defaultProps = defaultProps;

export default PageBlockTitle;
