import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal } from 'ljit-react-components';

const PREFIX_CLASS = 'page-message-modal';
const propTypes = {
	className: PropTypes.string,
	isFullMask: PropTypes.bool,
};
const defaultProps = {
	isFullMask: false,
};
const MessagePageModal = props => (
	<Modal.Message
		{...props}
		className={cx(PREFIX_CLASS, {
			[`${PREFIX_CLASS}--full-mask`]: props.isFullMask,
		}, props.className)}
	/>
);

MessagePageModal.propTypes = propTypes;
MessagePageModal.defaultProps = defaultProps;

export default MessagePageModal;
