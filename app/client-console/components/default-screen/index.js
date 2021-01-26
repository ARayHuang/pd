import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { OrderDetailDefaultPageSvg } from '../../images';

const propTypes = {
	message: PropTypes.string,
	className: PropTypes.string,
	imgSvg: PropTypes.string,
};
const defaultProps = {
	imgSvg: OrderDetailDefaultPageSvg,
};

function DefaultScreen({ imgSvg, message, className }) {
	return (
		<div className={cx('default-screen', className)}>
			<img src={imgSvg}/>
			<div className="notice-message">{message}</div>
		</div>
	);
}

DefaultScreen.propTypes = propTypes;
DefaultScreen.defaultProps = defaultProps;

export default DefaultScreen;
