import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
	Modal,
	Form,
	FormItem,
	Input,
	Button,
} from 'ljit-react-components';
import { EditOrderNumberSvg } from '../../../../../images';
import { orderNumberValidator } from '../../../../../lib/validator-utils';
import './styles.styl';

const propTypes = {
	isVisible: PropTypes.bool,
	orderNumber: PropTypes.string,
	onClickOk: PropTypes.func,
	onClickCancel: PropTypes.func,
};
const defaultProps = {
	isVisible: false,
	orderNumber: '',
	onClickOk: () => {},
	onClickCancel: () => {},
};
const PREFIX_CLASS = 'edit-modal';
const WIDTH = 320;

function EditModal({
	isVisible,
	orderNumber,
	onClickOk,
	onClickCancel,
}) {
	const formRef = useRef(null);

	function _handleFormSubmit(event) {
		const form = formRef.current.getForm();

		event.preventDefault();

		form.validateFields((err, { orderNumber }) => {
			if (!err) {
				onClickOk(orderNumber);
				form.resetFields();
			}
		});
	}

	function _handleClickCancel(event) {
		const form = formRef.current.getForm();

		event.preventDefault();

		onClickCancel();
		form.resetFields();
	}

	return (
		<Modal
			className={PREFIX_CLASS}
			width={WIDTH}
			visible={isVisible}
			onClickCancel={_handleClickCancel}
			footer=""
		>
			<div className={`${PREFIX_CLASS}__header`}>
				<img src={EditOrderNumberSvg}/>
				<div className={`${PREFIX_CLASS}__title`}>修改订单号</div>
			</div>

			<Form
				cancelButtonDisabled
				submitButtonDisabled
				ref={formRef}
			>
				<FormItem
					className={`${PREFIX_CLASS}__form-item`}
					key="orderNumber"
					itemName="orderNumber"
					labelColon={false}
					itemConfig={{
						initialValue: orderNumber,
						rules: [{
							required: true,
							validator: orderNumberValidator(),
						}],
					}}
				>
					<Input />
				</FormItem>
				<div className={`${PREFIX_CLASS}__footer`}>
					<Button
						className={`${PREFIX_CLASS}__cancel-btn`}
						onClick={_handleClickCancel}
					>
						取消
					</Button>
					<Button
						className={`${PREFIX_CLASS}__submit-btn`}
						onClick={_handleFormSubmit}
					>
						确定
					</Button>
				</div>
			</Form>
		</Modal>
	);
}

EditModal.propTypes = propTypes;
EditModal.defaultProps = defaultProps;

export default EditModal;
