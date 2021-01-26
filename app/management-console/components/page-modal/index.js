import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal } from 'ljit-react-components';
import MessagePageModal from './message';
import './style.styl';

const PREFIX_CLASS = 'page-modal';
const propTypes = {
	className: PropTypes.string,
	isFullMask: PropTypes.bool,
};
const defaultProps = {
	isFullMask: false,
};
const PageModal = props => (
	<Modal
		{...props}
		className={cx(PREFIX_CLASS, {
			[`${PREFIX_CLASS}--full-mask`]: props.isFullMask,
		}, props.className)}
	/>
);

PageModal.propTypes = propTypes;
PageModal.defaultProps = defaultProps;

PageModal.ModalSizeEnum = Modal.ModalSizeEnum;
PageModal.Message = MessagePageModal;

export default PageModal;
