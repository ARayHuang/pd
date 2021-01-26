import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './styles.styl';

const propTypes = {
	hasNewActivity: PropTypes.bool,
};
const defaultProps = {
	hasNewActivity: false,
};
const NewActivity = ({
	hasNewActivity,
} = {}) => {
	return (
		<div className={cx({ 'has-new-activity': hasNewActivity })}/>
	);
};

NewActivity.propTypes = propTypes;
NewActivity.defaultProps = defaultProps;

export default NewActivity;
