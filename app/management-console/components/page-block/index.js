import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Title from './title';
import './style.styl';

export const prefixClass = 'page-block';

const propTypes = {
	headerTitle: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
	]),
	children: PropTypes.any,
	className: PropTypes.string,
	noMinHeight: PropTypes.bool,
};
const defaultProps = {
	noMinHeight: false,
};

function PageBlock({
	children,
	className,
	headerTitle,
	noMinHeight,
}) {
	return (
		<div className={cx(prefixClass, className)}>
			{headerTitle && (
				<div className={`${prefixClass}__header`}>
					<Title text={headerTitle}/>
				</div>
			)}
			<div
				className={cx(`${prefixClass}__content`, {
					[`${prefixClass}__content--clear-height`]: noMinHeight === true,
				})}
			>
				{children}
			</div>
		</div>
	);
}

PageBlock.propTypes = propTypes;
PageBlock.defaultProps = defaultProps;

PageBlock.Title = Title;

export default PageBlock;
