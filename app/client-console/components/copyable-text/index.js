import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { Icon, Tooltip } from 'ljit-react-components';
import './style.styl';

const PREFIX_CLASS = 'copyable-text';
const propTypes = {
	isEllipsis: PropTypes.bool,
	prefix: PropTypes.string,
	text: PropTypes.string,
};
const defaultProps = {
	isEllipsis: false,
	prefix: '',
	text: '',
};
const { X_SMALL } = Icon.SizeEnums;
const { COPY } = Icon.IconTypeEnums;

function CopyableText({ isEllipsis, prefix, text }) {
	function _renderText(text) {
		return <div className={`${PREFIX_CLASS}__display`}>
			<span>{text}</span>
		</div>;
	}

	if (text) {
		const tooltipText = `${prefix}${text}`;
		const ellipsisText = text.length > 13 ? `${prefix}${text.slice(0, 13)}...` : tooltipText;

		return (
			<div className={PREFIX_CLASS} onClick={() => copy(text)}>
				{isEllipsis ?
					<Tooltip
						overlayClassName={`${PREFIX_CLASS}__tooltip-overlay`}
						title={_renderText(tooltipText)}
						isArrowPointAtCenter={true}
					>
						{_renderText(ellipsisText)}
					</Tooltip> : _renderText(tooltipText)
				}
				<div>
					<Icon type={COPY} size={X_SMALL}/>
				</div>
			</div>
		);
	}

	return null;
}

CopyableText.propTypes = propTypes;
CopyableText.defaultProps = defaultProps;

export default CopyableText;
