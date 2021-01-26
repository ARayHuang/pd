import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Modal } from 'ljit-react-components';
import { Warning } from '../../images';
import './style.styl';

const PREFIX_CLASS = 'client-container__confirm-modal';
const propTypes = {
	isVisible: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string,
	onClickOk: PropTypes.func,
	onClickCancel: PropTypes.func,
	isHideButtons: PropTypes.bool,
};
const defaultProps = {
	isVisible: false,
	title: '',
	message: '',
	onClickOk: () => {},
	onClickCancel: () => {},
	isHideButtons: false,
};

function ConfirmModal({
	isVisible,
	title,
	message,
	onClickOk,
	onClickCancel,
	isHideButtons,
}) {
	return (
		<Modal.Message
			title={
				<div className={`${PREFIX_CLASS}-title`}>
					<img src={Warning} size="16x16" />
					{title}
				</div>
			}
			visible={isVisible}
			message={message}
			onClickOk={onClickOk}
			onClickCancel={onClickCancel}
			cancelButtonClassname={`${PREFIX_CLASS}-cancel-btn`}
			className={cx(PREFIX_CLASS, { 'hide-buttons': isHideButtons })}
		/>
	);
}

ConfirmModal.propTypes = propTypes;
ConfirmModal.defaultProps = defaultProps;

export default ConfirmModal;
